import { getToken, validateToken } from '../utils/auth-helpers.js';

/**
 * A collection of error messages related to JWT authentication.
 */
const ERROR_MESSAGES = {
    JWT_GENERAL: 'Validation of token failed',
};

/**
 * Middleware to authenticate users based on the JWT token provided in the request headers.
 *
 * @param {Object} req - The request object which should contain an `authorization` header with the JWT token.
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function in the middleware stack.
 *
 * @returns {void} Returns nothing if the user is authenticated successfully, otherwise sends an HTTP response with an error status.
 *
 * @description This middleware function checks for the presence of an `authorization` header in the incoming request.
 *  If the header is missing, it responds with a 401 status code indicating that no credentials were provided.
 *  If the header is present, it attempts to extract and validate the JWT token using utility functions `getToken` and `validateToken`.
 *  If the token is valid, it attaches the user's ID to the `req.user` object and calls `next()` to pass control to the next middleware function or route handler.
 *  If the token is invalid, it responds with a 403 status code and an error message indicating that token validation failed.
 */
export const authUser = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ status: 'No credentials' });
    } else {
        const token = getToken(req.headers.authorization);
        const isTokenValid = validateToken(token);
        if (isTokenValid) {
            req.user = {
                id: isTokenValid.id,
            };
            return next();
        } else {
            return res.status(403).json({ status: ERROR_MESSAGES.JWT_GENERAL });
        }
    }
};
