import User from '../models/User.model.js';
import { validateUserInputs } from '../utils/validators.js';
import { generateNewToken, validateToken } from '../utils/auth-helpers.js';
import bcrypt from 'bcrypt';
import {
    BCRYPT_CONFIG,
    USER_CREATION_MESSAGES,
    HTTP_RESPONSE_COOKIE_CONFIG,
} from '../utils/constants.js';

export const registerUser = async (req, res) => {
    try {
        const errorsList = await validateUserInputs(req.body);
        if (errorsList.length > 0) {
            return res.status(400).json({
                errors: errorsList,
                data: { status: 'User not created' },
            });
        }

        // Using bcrypt.hash in an async manner
        try {
            const hash = await bcrypt.hash(
                req.body.password,
                BCRYPT_CONFIG.SALT_ROUNDS
            );
            await User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hash,
                phoneNumber: req.body.phoneNumber,
                profilePicture: '',
            });

            return res.status(201).json({
                errors: [],
                data: { status: USER_CREATION_MESSAGES.SUCCESS },
            });
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(
                'Error while generating hashing password',
                err.message
            );
            return res.status(500).json({
                errors: ['Error while generating hashing password'],
                data: { status: USER_CREATION_MESSAGES.FAILED },
            });
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('A technical error has occurred', error);
        return res.status(500).json({
            errors: ['A technical error has occurred'],
            data: { status: 'User not created' },
        });
    }
};

/**
 * Handles user login, including token generation and validation.
 *
 * @param {Object} req - The request object containing login credentials.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @returns {Promise} A promise that resolves to the HTTP response with either a token or an error message.
 */
export const loginUser = async (req, res) => {
    const cookieOptions = {
        maxAge: HTTP_RESPONSE_COOKIE_CONFIG.MAX_AGE,
        httpOnly: HTTP_RESPONSE_COOKIE_CONFIG.HTTP_ONLY,
    };

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({
                errors: ['User not found or invalid credentials'],
                data: {},
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(404).json({
                errors: ['User not found or invalid credentials'],
                data: {},
            });
        }

        // Check for existing cookie
        const existingToken = req.cookies._token ?? '';
        const isTokenValid = validateToken(existingToken);

        if (existingToken && isTokenValid) {
            res.cookie('_token', existingToken, cookieOptions);
            return res.status(200).json({
                data: { token: existingToken },
                errors: [],
            });
        }

        // Generate a new token for the user - possibly the token is expired or it's the first login attempt.
        const token = generateNewToken(user);
        res.cookie('_token', token, cookieOptions);
        return res.status(200).json({
            data: { token },
            errors: [],
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('An error occurred during the login process', error);
        return res.status(500).json({
            errors: ['An error occurred during the login process'],
            data: {},
        });
    }
};

/**
 * Fetches and returns user details by user ID.
 *
 * @param {Object} req - The request object from Express.js, containing the user's information in `req.user`.
 * @param {Object} res - The response object from Express.js used to send back the desired HTTP response.
 * @returns {Promise<Object>} A promise that resolves to the response object, which includes the user's details or an error message.
 */
export const getUser = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const userDetails = await User.findByPk(userId);
        const { firstName, lastName, email } = userDetails;
        return res.status(200).json({
            errors: [],
            data: {
                firstName,
                lastName,
                email,
            },
        });
    } catch (error) {
        return res.status(500).json({
            errors: ['A technical error has occurred'],
            data: {
                status: 'Could not verify token',
            },
        });
    }
};
