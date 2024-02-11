import express from 'express';
import {
    registerUser,
    loginUser,
    getUser,
} from '../controllers/User.controller.js';
import { authUser } from '../middlewares/auth.js';

const router = express.Router();

router.put('/register', registerUser);

router.post('/login', loginUser);

/**
 * @route GET /myprofile
 * @desc Fetch the user's profile information. This route is protected and requires authentication.
 * @access Protected
 * @middleware authUser - Ensures that the request is authenticated.
 */
router.get('/myprofile', authUser, getUser);

export default router;
