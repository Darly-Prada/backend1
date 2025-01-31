import express from 'express';
import { createCart, getCartById, addProductToCart } from '../controls/cartControls.js'; 

const router = express.Router();


router.post('/', createCart);
router.get('/:cid', getCartById);
router.post('/:cid/product/:pid', addProductToCart);

export default router;

