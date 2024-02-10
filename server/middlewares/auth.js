import { getToken, validateToken } from '../utils/auth-helpers.js';

const PROTECTED_ROUTES = {
    PROFILE: '/myprofile',
};

const ERROR_MESSAGES = {
    JWT_GENERAL: 'Validation of token failed',
};

export const authUser = (req, res, next) => {
    const requestedPathName = req._parsedUrl.pathname;
    if (Object.values(PROTECTED_ROUTES).includes(requestedPathName)) {
        if (!req.headers.authorization) {
            return res.status(401).json({ status: 'No credentials' });
        } else {
            const token = getToken(req.headers.authorization);
            const isValid = validateToken(token);
            if (isValid) {
                return next();
            } else {
                return res
                    .status(403)
                    .json({ status: ERROR_MESSAGES.JWT_GENERAL });
            }
        }
    }
    next();
};
