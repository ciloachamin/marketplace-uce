import express from 'express';
import { google, signOut, signin, signup, refresh } from '../controllers/auth.controller.js';
import { verifyToken} from '../utils/verifyUser.js';
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post('/google', google);
router.get('/signout', signOut)
router.post('/refresh', refresh);
router.get('/me', verifyToken, (req, res) => {
    res.json(req.user);
  });

export default router;