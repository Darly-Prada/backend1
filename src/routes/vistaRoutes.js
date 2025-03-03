import { Router } from "express";
import { ProductModel } from "../models/productModel.js";  
const route = Router();

route.get("/", async (req, res) => {
  try {
    // Obtener los productos desde MongoDB usando Mongoose
    const productos = await ProductModel.find();  // Obtener todos los productos desde MongoDB

    // Renderizar la vista con los productos
    res.render("home", { products: productos });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
});

export default route;
