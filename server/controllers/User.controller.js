import User from '../models/User.model.js';
import { validateUserInputs } from '../utils/validators.js';
import {
    generateNewToken,
    getToken,
    validateToken,
} from '../utils/auth-helpers.js';
import bcrypt from 'bcrypt';
import { BCRYPT_CONFIG, USER_CREATION_MESSAGES } from '../utils/constants.js';

export const registerUser = async (req, res) => {
    try {
        const errorsList = await validateUserInputs(req.body);
        if (errorsList.length === 0) {
            bcrypt.hash(
                req.body.password,
                BCRYPT_CONFIG.SALT_ROUNDS,
                async (err, hash) => {
                    if (!err) {
                        await User.create({
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            password: hash,
                            phoneNumber: req.body.phoneNumber,
                            profilePicture: '',
                        });
                    } else {
                        // eslint-disable-next-line no-console
                        console.error(
                            'Error while generating hashing password',
                            err.message
                        );
                    }
                    return res.status(201).json({
                        errors: [],
                        data: {
                            status: err
                                ? USER_CREATION_MESSAGES.FAILED
                                : USER_CREATION_MESSAGES.SUCCESS,
                        },
                    });
                }
            );
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
        const user = await User.findOne({
            where: {
                email,
            },
        });
        bcrypt.compare(password, user.password, (err, result) => {
            if (result && !err) {
                // Check for existing token in the authorization header
                const existingToken = getToken(req.headers.authorization);
                const isTokenValid = validateToken(existingToken);

                if (existingToken && isTokenValid) {
                    // If an existing token is valid, return it
                    return res.status(200).json({ token: existingToken });
                } else {
                    // Generate a new token for the user - possibly the token is expired or its the first login attempt.
                    const token = generateNewToken(user);
                    return res.status(200).json({
                        data: {
                            token,
                        },
                        errors: [],
                    });
                }
            } else {
                if (err) {
                    // eslint-disable-next-line no-console
                    console.error(
                        'An error occured during comparison of hashed and plain password',
                        err.message
                    );
                }
                // even if there is an error, we just want to return a generic error.
                return res.status(404).json({
                    errors: ['User not found or invalid credentials'],
                    data: {},
                });
            }
        });
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
