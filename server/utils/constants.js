/**
 * Configuration settings for bcrypt hashing function.
 */
export const BCRYPT_CONFIG = Object.freeze({
    SALT_ROUNDS: 10,
});

/**
 * Standard messages related to user creation outcomes.
 */
export const USER_CREATION_MESSAGES = Object.freeze({
    SUCCESS: 'Registration Successful',
    FAILED: 'Registration Failed',
});

/**
 * A collection of error messages related to JWT authentication.
 */
export const JWT_ERROR_MESSAGES = Object.freeze({
    JWT_GENERAL: 'Validation of token failed',
});

/**
 * Config for response cookie when user authenticates on /login route.
 */
export const HTTP_RESPONSE_COOKIE_CONFIG = Object.freeze({
    MAX_AGE: 1000 * 60 * 15, // would expire after 15 minutes
    HTTP_ONLY: true,
});
