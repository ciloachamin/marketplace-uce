import express from 'express';
import { 
  createTransaction,
  getTransactionHistory
} from '../controllers/transaction.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/', verifyToken, createTransaction);
router.get('/user/:userId', verifyToken, getTransactionHistory);

export default router;