import express from 'express';

import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { __dirname,uploader } from '../../utilis.js';
import { productModel } from '../models/productModel.js';

const route = express.Router();


route.post("/", async (req, res) => {
    try {
        const prod = req.body;
       const respuesta = await productModel.create({...prod });
        res.status(201).json({payload:respuesta})
        return res.json({
            mensaje: "Producto guardado correctamente",
            payload: respuesta
        });
    } catch (error) {
        console.error("Error al guardar producto:", error);   
        return res.status(500).json({
            mensaje: "Error al guardar producto",
            error: error.message
        });
    }
});
    // Leer todos los productos 
route.get("/", async (req, res) => {
    try {
        const respuesta = await productModel.find(); 
        res.json({respuesta });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ mensaje: "Error al obtener productos", error: error.message });
    }  
});
// Leer un producto por su Id 
route.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await productModel.findById(id); 
        if (!producto) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        res.json({ mensaje: "Producto encontrado", payload: producto });
    } catch (error) {
        console.error("Error al obtener producto:", error);
        res.status(500).json({ mensaje: "Error al obtener producto", error: error.message });
    }
});
// Actualizar producto Id  
route.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;  
        const body = req.body;  
        const productoActualizado = await productModel.findByIdAndUpdate(id, body, { new: true });
        if (!productoActualizado) {
            return res.status(404).json({ mensaje: "Producto no encontrado para actualizar" });
        }
        res.json({ mensaje: "Producto actualizado correctamente", payload: productoActualizado });
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ mensaje: "Error al actualizar producto", error: error.message });
    }
});
// Eliminar producto por Id
route.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params; 
        const productoEliminado = await productModel.findByIdAndDelete(id);
        if (!productoEliminado) {
            return res.status(404).json({ mensaje: "Producto no encontrado para eliminar" });
        }
        res.json({ mensaje: "Producto eliminado correctamente", payload: productoEliminado });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ mensaje: "Error al eliminar producto", error: error.message });
    }
});
export default route;
