import express from 'express';
import {
    registerUser,
    loginUser,
    getUser,
} from '../controllers/User.controller.js';
import { authUser } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @route PUT /register
 * @desc Registers a new user with the provided details. This route is not protected and is accessible without authentication.
 * @access Public
 */
router.put('/register', registerUser);

/**
 * @route POST /login
 * @desc Authenticates a user and returns a JWT token for accessing protected routes. This route is not protected and is accessible without authentication.
 * @access Public
 */
router.post('/login', loginUser);

/**
 * @route GET /myprofile
 * @desc Fetch the user's profile information. This route is protected and requires authentication.
 * @access Protected
 * @middleware authUser - Ensures that the request is authenticated.
 */
router.get('/myprofile', authUser, getUser);

export default router;
