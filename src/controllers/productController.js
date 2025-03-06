import { productModel } from "../models/productModel.js";

// Obtener todos los productos con paginación y filtros
export const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort = 'asc', query } = req.query;
    const sortOrder = sort === "desc" ? -1 : 1;

    let filter = {};
    if (query) {
      filter = {
        $or: [
          { category: { $regex: query, $options: "i" } },
          { status: { $regex: query, $options: "i" } }
        ]
      };
    }

    const result = await productModel.paginate(filter, {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: { price: sortOrder }
    });

    res.status(200).json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.page - 1,
      nextPage: result.page + 1,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?page=${result.page - 1}&limit=${limit}&sort=${sort}` : null,
      nextLink: result.hasNextPage ? `/api/products?page=${result.page + 1}&limit=${limit}&sort=${sort}` : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
  }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
  }
};

// Agregar un nuevo producto
export const addProduct = async (req, res) => {
  const { title, description, price, stock, category } = req.body;
  if (!title || !description || !price || !stock || !category) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    const newProduct = new productModel({ title, description, price, stock, category, status: true });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el producto', error: error.message });
  }
};

// Actualizar un producto
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await productModel.findByIdAndUpdate(req.params.pid, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto', error: error.message });
  }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await productModel.findByIdAndDelete(req.params.pid);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
  }
};

