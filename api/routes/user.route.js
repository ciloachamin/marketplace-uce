import express from 'express';
import { deleteUser, test, updateUser,  getUserListings, getUser, getUserProducts, getUserShop, getAllUsers} from '../controllers/user.controller.js';
import { verifyToken, adminAndShop} from '../utils/verifyUser.js';


const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/listings/:id', verifyToken, getUserListings)
router.get('/products/:id', verifyToken, getUserProducts)
router.get('/shops/:id', verifyToken, getUserShop)
router.get('/:id', verifyToken, getUser)
router.get('/', verifyToken, adminAndShop, getAllUsers);
export default router;