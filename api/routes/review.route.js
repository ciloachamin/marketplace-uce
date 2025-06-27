import express from 'express';
import { 
  createReview, 
  getProductReviews, 
  updateReview, 
  deleteReview 
} from '../controllers/review.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createReview);
router.get('/product/:productId', getProductReviews);
router.put('/update/:reviewId', verifyToken, updateReview);
router.delete('/delete/:reviewId', verifyToken, deleteReview);

export default router;