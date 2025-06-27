import express from 'express';
import {
  createProduct,
  getProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  getProduct,
  searchProducts,
  getAdminEllProducts,
  getProductsWithUsers,
  getProductsFilter,
} from '../controllers/product.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createProduct);
router.get('/get', getProducts);
router.get('/filter', getProductsFilter);
router.get('/get/:id', getProduct);
router.get('/:slug', getProductBySlug);
router.put('/update/:id', verifyToken, updateProduct);
router.delete('/delete/:id', verifyToken, deleteProduct);
router.get('/search', searchProducts);
router.get('/users', getProductsWithUsers);
router.get('/admin', getAdminEllProducts);




export default router;