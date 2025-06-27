import express from 'express';
import { 
  createCategory, 
  deleteCategory, 
  updateCategory, 
  getCategory, 
  getCategories,
  getCategoryBySlug
} from '../controllers/category.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createCategory);
router.delete('/delete/:id', verifyToken, deleteCategory);
router.put('/update/:id', verifyToken, updateCategory);
router.get('/get/:id', getCategory);
router.get('/get-by-slug/:slug', getCategoryBySlug);
router.get('/get', getCategories);

export default router;