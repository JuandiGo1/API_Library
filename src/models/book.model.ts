import { model, Schema } from "mongoose";

// DECLARE MODEL TYPE
type BookType = {
  title: string;
  author: string;
  genre: string;
  publisher: string;
  publicationDate: Date;
  number_copies: Number,
  available: boolean;
  isActive: boolean;
};

// DECLARE MONGOOSE SCHEMA
const BookSchema = new Schema<BookType>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  publisher: { type: String, required: true },
  publicationDate: { type: Date, required: true },
  number_copies: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  available: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true }, 
});



// DECLARE MONGO MODEL
const BookModel = model<BookType>("BOok", BookSchema);

// EXPORT ALL
export { BookModel, BookSchema, BookType };
