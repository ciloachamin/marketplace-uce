import express from 'express';
import { 
  createRequest, 
  getRequests,
  checkUserRequest,
  updateRequest 
} from '../controllers/request.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/', verifyToken, createRequest);
router.get('/', verifyToken, getRequests); 
router.put('/:id', verifyToken, updateRequest); 
router.get('/check', verifyToken, checkUserRequest);

export default router;