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
    SUCCESS: 'Registration Succesfull',
    FAILED: 'Registrartion Failed',
});

/**
 * A collection of error messages related to JWT authentication.
 */
export const ERROR_MESSAGES = Object.freeze({
    JWT_GENERAL: 'Validation of token failed',
});
