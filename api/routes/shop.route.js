import express from 'express';
import { createShop, deleteShop, updateShop, getShop, getShops,addShopOwner,removeShopOwner } from '../controllers/shop.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createShop);
router.delete('/delete/:id', verifyToken, deleteShop);
router.put('/update/:id', verifyToken, updateShop);
router.patch('/:shopId/add-owner/:userId', verifyToken, addShopOwner);
router.patch('/:shopId/remove-owner/:userId', verifyToken, removeShopOwner);
router.get('/get/:id', getShop);
router.get('/get', getShops);

export default router;
