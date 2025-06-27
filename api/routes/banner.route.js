import express from 'express';
import {
  createBanner,
  getBanner,
  getBanners,
  updateBanner,
  deleteBanner,
} from '../controllers/banner.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createBanner);
router.get('/get/:id', getBanner);
router.get('/get', getBanners);
router.post('/update/:id', verifyToken, updateBanner);
router.delete('/delete/:id', verifyToken, deleteBanner);

export default router;
