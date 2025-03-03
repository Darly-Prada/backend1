import express from 'express';
import { createCart, getCartById, addProductToCart, removeProductFromCart, clearCart } from '../controllers/cartController.js';

const router = express.Router();

// Rutas para crear el carrito, obtenerlo por ID, agregar productos, eliminar productos y vaciar el carrito
router.post('/', createCart);  // Crear un carrito
router.get('/:cid', getCartById);  // Obtener un carrito por ID
router.post('/:cid/product/:pid', addProductToCart);  // Agregar un producto al carrito
router.delete('/:cid/product/:pid', removeProductFromCart);  // Eliminar un producto del carrito
router.delete('/:cid', clearCart);  // Vaciar el carrito

export default router;
