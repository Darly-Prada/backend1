
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'data', 'cart.json');   
const productFilePath = path.join(process.cwd(), 'src', 'data', 'products.json');  

// Crear un nuevo carrito
export const createCart = (req, res) => {
  const { products } = req.body; 

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error leyendo los carritos' });

    let carts = JSON.parse(data);
    const newCart = {
      id: Date.now(),  // ID único generado
      products: products || [],
    };

    carts.push(newCart);

    fs.writeFile(filePath, JSON.stringify(carts, null, 2), (err) => {
      if (err) return res.status(500).json({ message: 'Error al crear el carrito' });
      res.status(201).json(newCart);
    });
  });
};

// Obtener un carrito por ID
export const getCartById = (req, res) => {
  const { cid } = req.params;
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error leyendo los carritos' });

    const carts = JSON.parse(data);
    const cart = carts.find((c) => c.id == cid);

    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    res.status(200).json(cart);
  });
};

// Agregar un producto al carrito
export const addProductToCart = (req, res) => {
  const { cid, pid } = req.params;

  fs.readFile(filePath, 'utf-8', (err, cartData) => {
    if (err) return res.status(500).json({ message: 'Error leyendo los carritos' });

    let carts = JSON.parse(cartData);
    const cart = carts.find((c) => c.id == cid);

    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    fs.readFile(productFilePath, 'utf-8', (err, productData) => {
      if (err) return res.status(500).json({ message: 'Error leyendo los productos' });

      const products = JSON.parse(productData);
      const product = products.find((p) => p.id == pid);

      if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

      // Verificar si el producto ya está en el carrito
      const existeProduct = cart.products.find((p) => p.id == pid);
      if (existeProduct) {
        existeProduct.quantity += 1;
      } else {
        cart.products.push({ id: pid, quantity: 1 });
      }
    
      fs.writeFile(filePath, JSON.stringify(carts, null, 2), (err) => {
        if (err) return res.status(500).json({ message: 'Error al actualizar el carrito' });
        res.status(200).json(cart);
      });
    });
  });
};
