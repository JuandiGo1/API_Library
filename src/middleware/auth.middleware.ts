import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import {token_acc} from "../routes/user.routes";
interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

const authMiddleware = (requiredRole?: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = token_acc;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Acceso denegado. Token no proporcionado." });
    }


    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: string;
        role: string;
      };
      req.user = decoded;

      // Verificar el rol si se requiere un rol específico
      if (requiredRole && req.user.role !== requiredRole) {
        return res
          .status(403)
          .json({ message: "Acceso denegado. Permisos insuficientes." });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Token inválido o expirado." });
    }
  };
};

export {authMiddleware,AuthRequest};
