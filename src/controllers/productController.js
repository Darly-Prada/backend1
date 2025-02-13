
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'data', 'products.json');  

// Obtener todos los productos y uso limit 
export const getProducts = (req, res) => {
  const { limit } = req.query; 

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error al leer los productos' });
    }
    const products = JSON.parse(data);
      const limitProducts =  limit ? products.slice(0, parseInt(limit)): products;

    res.status(200).json(limitProducts);
  });
};

// Obtener un producto por ID
export const getProductById = (req, res) => {
  const { pid } = req.params;
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error al leer los productos' });
    }
    const products = JSON.parse(data);
    const product = products.find(p => p.id == pid);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(product);
  });
};

// Agregar un nuevo producto
export const addProduct = (req, res) => {
  const { title, description, code, price, stock, category } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  const newProduct = {
    id: Date.now(),  // Generar un ID único
    title,
    description,
    code,
    price,
    stock,
    category,
    status: true,
  };

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error al leer los productos' });
    }

    const products = JSON.parse(data);
    const existProduct = products.find(p => p.id === newProduct.id);

    if (existProduct) {
      return res.status(400).json({ message: 'El ID del producto ya existe.' });
    }

    products.push(newProduct);

    fs.writeFile(filePath, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error al guardar el producto' });
      }
      res.status(201).json(newProduct);
    });
  });
};

// Actualizar un producto
export const updateProduct = (req, res) => {
  const { pid } = req.params;
  const { title, description, code, price, stock, category, status } = req.body;

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error al leer los productos' });
    }

    const products = JSON.parse(data);
    const index = products.findIndex(p => p.id == pid);

    if (index === -1) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const updatedProduct = {
      ...products[index],  // Copiar los valores actuales
      title, 
      description, 
      code, 
      price, 
      stock, 
      category, 
      status: status === undefined ? true : status, // Usar true como valor por defecto
    };

    products[index] = updatedProduct;

    fs.writeFile(filePath, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error al guardar la actualización' });
      }
      res.status(200).json(updatedProduct);
    });
  });
};

// Eliminar un producto
export const deleteProduct = (req, res) => {
  const { pid } = req.params;

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error al leer los productos' });
    }

    const products = JSON.parse(data);
    const index = products.findIndex(p => p.id == pid);

    if (index === -1) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    products.splice(index, 1);

    fs.writeFile(filePath, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error al eliminar el producto' });
      }
      res.status(200).json({ message: 'Producto eliminado correctamente' });
    });
  });
};
