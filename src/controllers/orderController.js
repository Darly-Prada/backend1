import { orderModel } from '../models/orderModel.js';
import CartModel from '../models/cartModel.js';

export const createOrder = async (req, res) => {
  const { cartId, customer } = req.body;

  try {
    // Obtener el carrito
    const cart = await CartModel.findById(cartId);
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    // Crear una nueva orden
    const newOrder = new orderModel({
      cartId: cart._id,
      customer,
      products: cart.products,
      status: 'pending'
    });
    await newOrder.save();    
    await CartModel.findByIdAndDelete(cartId);

    res.status(201).json({ message: 'Orden creada con éxito', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la orden', error });
  }
};