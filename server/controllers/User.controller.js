import User from '../models/User.model.js';
import { validateUserInputs } from '../utils/validators.js';
import {
    generateNewToken,
    getToken,
    validateToken,
} from '../utils/auth-helpers.js';

export const registerUser = async (req, res) => {
    try {
        const errorsList = await validateUserInputs(req.query);
        if (errorsList.length === 0) {
            await User.create({
                firstName: req.query.firstName,
                lastName: req.query.firstName,
                email: req.query.email,
                password: req.query.password,
                phoneNumber: req.query.phoneNumber,
                profilePicture: '',
            });
            return res.status(201).json({
                errors: [],
                data: {
                    status: 'User created successfully',
                },
            });
        } else {
            return res.status(400).json({
                errors: errorsList,
                data: {
                    status: 'User not created',
                },
            });
        }
    } catch (error) {
        return res.status(500).json({
            errors: ['A technical error has occurred'],
            data: {
                status: 'User not created',
            },
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
    try {
        const { email, password } = req.body;

        // TODO, use bcrypt to compare passwords
        const user = await User.findOne({
            where: {
                email,
                password,
            },
        });

        if (user) {
            // Check for existing token in the authorization header
            const existingToken = getToken(req.headers.authorization);
            const isTokenValid = validateToken(existingToken);

            if (existingToken && isTokenValid) {
                // If an existing token is valid, return it
                return res.status(200).json({ token: existingToken });
            } else {
                // Generate a new token for the user - possibly the token is expired.
                const token = generateNewToken(user);
                return res.status(200).json({ token });
            }
        } else {
            return res
                .status(404)
                .json({ message: 'User not found or invalid credentials' });
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return res.status(500).json({
            message: 'An error occurred during the login process',
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
