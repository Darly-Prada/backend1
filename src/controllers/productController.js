import { ProductModel } from "../models/productModel.js";  


// Obtener todos los productos
export const getProducts = async (req, res) => {
  try {
    const { limit } = req.query;  // Obtener parámetro de query (limit)

    // Si hay límite, se aplica, si no, se obtienen todos
    const products = limit ? await ProductModel.find().limit(parseInt(limit)) : await ProductModel.find(); 
    
    res.status(200).json(products);  // Enviar los productos como respuesta
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
  }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
  const { pid } = req.params;  // Obtener el ID desde los parámetros de la URL

  try {
    const product = await ProductModel.findById(pid);  // Buscar el producto por su ID

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json(product);  // Enviar el producto encontrado
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
  }
};

// Agregar un nuevo producto
export const addProduct = async (req, res) => {
  const { title, description, price, stock, category } = req.body;  // Obtener datos del cuerpo de la solicitud

  if (!title || !description || !price || !stock || !category) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    const newProduct = new ProductModel({ title, description, price, stock, category, status: true });
    const savedProduct = await newProduct.save();  // Guardar el nuevo producto en la base de datos

    res.status(201).json(savedProduct);  // Enviar el producto guardado como respuesta
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el producto', error: error.message });
  }
};

// Actualizar un producto
export const updateProduct = async (req, res) => {
  const { pid } = req.params;  // Obtener el ID desde los parámetros
  const { title, description, price, stock, category, status } = req.body;  // Obtener los datos para actualizar

  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(pid, { title, description, price, stock, category, status }, { new: true });
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json(updatedProduct);  // Enviar el producto actualizado como respuesta
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto', error: error.message });
  }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
  const { pid } = req.params;  // Obtener el ID del producto a eliminar

  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(pid);  // Eliminar el producto por su ID

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json({ message: 'Producto eliminado correctamente' });  // Confirmar la eliminación
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
  }
};