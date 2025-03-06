import { cartModel } from '../models/cartModel.js';
import { productModel } from '../models/productModel.js';

// Crear un carrito
export const createCart = async (req, res) => {
  try {
    const newCart = new cartModel({ products: [] });
    await newCart.save();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el carrito', error: error.message });
  }
};

// Obtener un carrito por su ID
export const getCartById = async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartModel.findById(cid).populate('products.productId', 'price descripcion');
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    // Calcular el total del carrito
    cart.calculateTotal(); 
    await cart.save();
    
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito', error: error.message });
  }
};


// Agregar un producto al carrito
export const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    const product = await productModel.findById(pid);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    console.log('Producto recuperado completo:', product);
    console.log('Producto recuperado:', product);
    console.log('Precio del producto recuperado:', product.price);
    console.log('Tipo de dato de product.price:', typeof product.price);

    const existingProduct = cart.products.find(p => p.productId.toString() === pid);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({
        productId: product._id,
        quantity: 1,
        price: product.price,
        description: product.description
      });
    }

    let total = 0;
    cart.products.forEach(item => {
      console.log(`Producto: ${item.productId}, Precio: ${item.price}, Cantidad: ${item.quantity}`);
      total += (item.price) * (item.quantity);
    });
    cart.total = total;

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ message: 'Error al agregar producto al carrito', error: error.message });
  }
};
// Eliminar un producto del carrito
export const removeProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    cart.products = cart.products.filter(p => p.productId.toString() !== pid);
    cart.calculateTotal(); // Recalcular el total
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto del carrito', error: error.message });
  }
};

// Vaciar el carrito
export const clearCart = async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    cart.products = [];
    cart.total = 0; // Reiniciar el total
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al vaciar el carrito', error: error.message });
  }
};


