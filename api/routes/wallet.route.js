import express from 'express';
import { 
  getUserWallets,
  getWalletDetails,
  addPointsToWallet,
  redeemPointsFromWallet,
  getWalletTransactions
} from '../controllers/wallet.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/user/:userId', verifyToken, getUserWallets);
router.get('/:walletId', verifyToken, getWalletDetails);
router.post('/add-points', verifyToken, addPointsToWallet);
router.post('/redeem-points', verifyToken, redeemPointsFromWallet);
router.get('/transactions/:walletId', verifyToken, getWalletTransactions);

export default router;