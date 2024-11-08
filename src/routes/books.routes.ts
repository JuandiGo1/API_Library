import { Router, Request, Response } from "express";
import { BookModel } from "../models/book.model";
import { authMiddleware } from "../middleware/auth.middleware";

// INIT ROUTES
const bookRoutes = Router();

bookRoutes.post("/books/create",  authMiddleware('admin'), async (req, res) => {
  try {
    const { title, author, genre, publisher, publicationDate , number_copies} = req.body;

    // Validar campos requeridos
    if (!title || !author || !genre || !publisher || !publicationDate) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    // Crear el nuevo libro
    const newBook = new BookModel({
      title,
      author,
      genre,
      publisher,
      publicationDate,
      number_copies,
      available: true,
      isActive: true,
    });

    // Guardar el libro en la base de datos
    await newBook.save();

    res.status(201).json({ message: "Libro creado exitosamente", book: newBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor al crear el libro." });
  }
  });

  bookRoutes.get('/books', async (req: Request, res: Response) => {
    try {
      const { id, genre, publicationDate, publisher, author, title, available } = req.query;
  
      // Si se proporciona un ID, buscar por ID específico
      if (id) {
        const book = await BookModel.findById(id);
        if (!book) {
          return res.status(404).json({ message: "Libro no encontrado." });
        }
        return res.status(200).json(book);
      }
  
      const filters: any = {};
  
      if (genre) filters.genre = genre;
      if (publicationDate) filters.publicationDate = new Date(publicationDate as string);
      if (publisher) filters.publisher = publisher;
      if (author) filters.author = author;
      if (title) filters.title = { $regex: new RegExp(title as string, 'i') }; // Búsqueda parcial
      if (available !== undefined) filters.available = available === 'true';
  
      // Buscar libros que cumplan con los filtros
      const books = await BookModel.find(filters);
      if(books.length ==0){
        return res.status(404).json({ message: "No se encontraron libros con los filtros aplicados." });
      }
  
      res.status(200).json(books);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error en el servidor al buscar libros." });
    }
  });

  bookRoutes.put('/update/:id', authMiddleware('admin'), async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, author, genre, publisher, publicationDate, number_copies, available } = req.body;
  
  
      // Verificar que el libro existe
      const existingBook = await BookModel.findById(id);
      if (!existingBook) {
        return res.status(404).json({ message: "Libro no encontrado." });
      }
  
      // Actualizar el libro con los campos proporcionados
      const updatedBook = await BookModel.findByIdAndUpdate(
        id,
        { title, author, genre, publisher, publicationDate, number_copies, available },
        { new: true, runValidators: true } // Retorna el libro actualizado y aplica validaciones
      );
  
      res.status(200).json({ message: "Libro actualizado con éxito", updatedBook });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error en el servidor al actualizar el libro." });
    }
  });


  bookRoutes.delete('/delete/:id', authMiddleware('admin'), async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const book = await BookModel.findById(id);
      if (!book) {
        return res.status(404).json({ message: "Libro no encontrado." });
      }
    
      book.isActive = false;
      await book.save();
  
      res.status(200).json({ message: "Libro inhabilitado con éxito" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error en el servidor al inhabilitar el libro." });
    }
  });
  export default bookRoutes;