import express from 'express';
import { cartModel } from '../models/cartModel.js';
import { productModel } from '../models/productModel.js';

const router = express.Router();

// Crear un carrito
router.post('/', async (req, res) => {
  const newCart = await cartModel.create({ products: [] });
  res.status(201).json({ message: "Carrito creado", cart: newCart });
});

// Obtener un carrito por ID
router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartModel.findById(req.params.cid).populate('products.productId');
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({ error: 'Error al obtener carrito' });
  }
});

// Agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cart = await cartModel.findById(req.params.cid).populate('products.productId');
    const product = await productModel.findById(req.params.pid);
    if (!cart || !product) {
      return res.status(404).json({ error: 'Carrito o producto no encontrado' });
    }

    // Lógica para agregar o actualizar el producto en el carrito
    const existingProduct = cart.products.find(p => p.productId.toString() === req.params.pid);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({
        productId: req.params.pid,
        quantity: 1,
        price: product.price,
        description: product.description
      });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    res.status(500).json({ error: 'Error al agregar al carrito' });
  }
});

export default router;

