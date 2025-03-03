import Cart from '../models/cartModel.js';
import { ProductModel } from '../models/productModel.js'


// Crear un carrito
export const createCart = async (req, res) => {
  const newCart = new Cart({ products: [] });
  await newCart.save();
  res.status(201).json(newCart);
};

// Obtener un carrito por su ID
export const getCartById = async (req, res) => {
  const { cid } = req.params;
  const cart = await Cart.findById(cid).populate('products.productId');
  if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
  cart.calculateTotal();
  await cart.save();
  res.status(200).json(cart);
};

// Agregar un producto al carrito
export const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await Cart.findById(cid);
  if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

  const product = await Product.findById(pid);
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

  const existingProduct = cart.products.find(p => p.productId.toString() === pid);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.products.push({ productId: pid, quantity: 1 });
  }

  cart.calculateTotal();
  await cart.save();
  res.status(200).json(cart);
};

// Eliminar producto del carrito
export const removeProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await Cart.findById(cid);
  if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

  cart.products = cart.products.filter(p => p.productId.toString() !== pid);
  cart.calculateTotal();
  await cart.save();
  res.status(200).json(cart);
};

// Vaciar el carrito
export const clearCart = async (req, res) => {
  const { cid } = req.params;
  const cart = await Cart.findById(cid);
  if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

  cart.products = [];
  cart.total = 0;
  await cart.save();
  res.status(200).json(cart);
};
