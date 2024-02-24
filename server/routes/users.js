import express from 'express';
import {
    registerUser,
    loginUser,
    getUser,
    logoutUser,
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
 * @route GET /auth-user
 * @desc Fetch the user's profile information. This route is protected and requires authentication.
 * @access Protected
 * @middleware authUser - Ensures that the request is authenticated.
 */
router.get('/auth-user', authUser, getUser);

/**
 * @route POST /logout
 * @desc Logs out the user by clearing the JWT token cookie.
 * @access Protected
 */
router.post('/logout', authUser, logoutUser);

export default router;
