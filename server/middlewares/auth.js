import { getToken, validateToken } from '../utils/auth-helpers.js';

const ERROR_MESSAGES = {
    JWT_GENERAL: 'Validation of token failed',
};

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
