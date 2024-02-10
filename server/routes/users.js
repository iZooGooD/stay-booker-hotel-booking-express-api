import express from 'express';
import {
    registerUser,
    loginUser,
    userDetails,
} from '../controllers/User.controller.js';
import { authUser } from '../middlewares/auth.js';

const router = express.Router();

router.use(authUser);

router.put('/register', registerUser);

router.post('/login', loginUser);

router.get('/myprofile', userDetails);

export default router;
