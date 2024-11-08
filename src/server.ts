import { Request, Response } from "express";
import cors from "cors";
import express from "express";

// API ROUTES IMPORTS
import {userRoutes} from "./routes/user.routes";
import bookRoutes from "./routes/books.routes";

require('./config/db')

// MIDDLEWARES
const app = express();


app.use(cors());
app.use(express.json());

// ROUTES
app.use(userRoutes);
app.use(bookRoutes);

// FALLBACKS

function routeNotFound(request: Request, response: Response) {
  response.status(404).json({
    message: "Route not found.",
  });
}

app.use(routeNotFound);

// START SERVER
app.listen(8080, () => {
  console.log("Server listening to port 8080.");
});
