
import express from 'express';
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from '../controls/productControls.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:pid', getProductById);
router.post('/', addProduct);
router.put('/:pid', updateProduct);
router.delete('/:pid', deleteProduct);

export default router;
