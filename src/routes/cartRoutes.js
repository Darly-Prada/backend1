import express from 'express';
import { cartModel } from '../models/cartModel.js';
import { productModel } from '../models/productModel.js'; 


const router = express.Router();

// Crear un carrito
router.post('/', async (req, res) => {
  try {
    const newCart = new cartModel({ products: [] });
    const cart = await newCart.save();
    res.status(201).json(cart);  // Retorna el carrito creado
  } catch (error) {
    console.error('Error al crear carrito:', error);
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

// Obtener un carrito por ID
router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartModel.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart);
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

// Agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    // Buscar el carrito por ID
    const cart = await cartModel.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Verificar que el producto exista en la base de datos
    const product = await productModel.findById(req.params.pid);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Agregar o actualizar producto en el carrito
    const existingProduct = cart.products.find(product => product.productId.toString() === req.params.pid);
    if (existingProduct) {
      existingProduct.quantity += 1;  // Aumentamos la cantidad si el producto ya está en el carrito
    } else {
      cart.products.push({ productId: req.params.pid, quantity: 1, precio: product.precio, descripcion: product.descripcion });
    }

    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
});

export default router;
