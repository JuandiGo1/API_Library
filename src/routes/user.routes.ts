import { Router, Request, Response } from "express";
import { readUsers } from "../controllers/user.controller";
import { UserModel } from "../models/user.model";
import  {authMiddleware, AuthRequest} from "../middleware/auth.middleware";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import dotenv from 'dotenv';

dotenv.config();
// INIT ROUTES
const userRoutes = Router();
let token_acc = ''
 
// DECLARE ENDPOINT FUNCTIONS
async function GetUser(request: Request, response: Response) {
  const users = await readUsers();

  response.status(200).json({
    message: "Success.",
    users: users,
  });
}

// DECLARE ENDPOINTS
userRoutes.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nombre, correo y contraseña son obligatorios." });
    }

    // Verificar si el usuario ya existe
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya está registrado." });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      role: role || 'user', // Valor por defecto para el rol
    });

    // Guardar el usuario en la base de datos
    await user.save();

    res.status(201).json({ message: "Usuario creado exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor al registrar el usuario." });
  }
});


userRoutes.post("/login", async (req,res)=>{
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if(!user){
      return res.status(400).json({ message: "Correo o contraseña incorrectos" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Correo o contraseña incorrectos" });
    }

    const token = jwt.sign(
      {userId: user._id, role: user.role},
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    )

    token_acc = token;

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token: token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor al iniciar sesión" });
  }
});


userRoutes.put('/update/:mail', authMiddleware(), async (req: AuthRequest, res: Response) => {
  try {
    const userMail = req.params.mail;
    const { name, email, role } = req.body;
    
    // Usuario autenticado y sus datos
    const authenticatedUserId = req.user?.userId;
    const authenticatedUserRole = req.user?.role;
    const existingUser = await UserModel.findOne({  email: userMail });
    if (!existingUser) {
      return res.status(400).json({ message: "El usuario no se encuentra registrado." });
    }

    const userId =  existingUser._id.toString()
    // Verificar si el usuario autenticado es el mismo que el que se quiere actualizar
    // o si tiene permiso de administrador/admin
    if (authenticatedUserId !==userId && authenticatedUserRole !== 'admin') {
      return res.status(403).json({ message: "Acceso denegado. Permisos insuficientes." });
    }

    
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { name, email, role }, // Campos que pueden actualizarse
      { new: true, runValidators: true } // Retornar el usuario actualizado
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    res.status(200).json({ message: "Usuario actualizado con éxito", updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor al actualizar el usuario." });
  }
});


userRoutes.delete('/delete/:mail', authMiddleware(), async (req: AuthRequest, res: Response) => {
  try {
    const userMail = req.params.mail;
    const authenticatedUserId = req.user?.userId;
    const authenticatedUserRole = req.user?.role;
    const existingUser = await UserModel.findOne({ email: userMail });

    if (!existingUser) {
      return res.status(400).json({ message: "El usuario no se encuentra registrado." });
    }

    const userId = existingUser._id.toString();

    if (authenticatedUserId !== userId && authenticatedUserRole !== 'admin') {
      return res.status(403).json({ message: "Acceso denegado. Permisos insuficientes." });
    }

    // Inhabilitar el usuario en lugar de eliminarlo
    existingUser.isActive = false;
    await existingUser.save();

    res.status(200).json({ message: "Usuario inhabilitado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor al inhabilitar el usuario." });
  }
});

// EXPORT ROUTES
export  {userRoutes, token_acc};
