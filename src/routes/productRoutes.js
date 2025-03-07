import express from 'express';
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from '../controllers/productController.js';  
import { __dirname, uploader } from '../../utilis.js';
import { productModel } from '../models/productModel.js';


const route = express.Router();

// route.get('/products', getProducts,getProductById,addProduct,updateProduct,deleteProduct);

// Crear un nuevo producto
route.post("/", async (req, res) => {
    try {
        const prod = req.body;
        const result = await productModel.create({ ...prod });
        res.status(201).json({ mensaje: "Producto guardado correctamente", payload: result });
    } catch (error) {
        // console.error("Error al guardar producto:", error);
        res.status(500).json({ mensaje: "Error al guardar producto", error: error.message });
    }
});
// Leer todos los productos con paginación
route.get("/", async (req, res) => {
    try {
        const respuesta = await getProducts(req, res); 
        res.json({ respuesta });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ mensaje: "Error al obtener productos", error: error.message });
    }
});

// Leer un producto por su Id
route.get("/:id", async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        res.status(200).json({ mensaje: "Producto encontrado", payload: product });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener producto", error: error.message });
    }
});

// Actualizar producto por Id
route.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const productoActualizado = await updateProduct(id, body);
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
    const productId = req.params.id;
    try {
        const deletedProduct = await productModel.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        res.status(200).json({ mensaje: "Producto eliminado correctamente", payload: deletedProduct });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar producto", error: error.message });
    }
});

export default route;

