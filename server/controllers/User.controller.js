import User from '../models/User.model.js';
import {
    validateEmail,
    validatePhoneNumber,
    UserExists,
} from '../utils/validators.js';

const validateUserInput = async ({
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
}) => {
    const errorsList = [];

    // Validate firstName
    if (!firstName) errorsList.push('first name is required');
    else if (firstName.length < 3)
        errorsList.push('The first name must be at least 4 characters long.');
    else if (firstName.length > 64)
        errorsList.push('The first name must not exceed 64 characters.');

    // Validate lastName
    if (!lastName) errorsList.push('last name is required');
    else if (lastName.length < 3)
        errorsList.push('The last name must be at least 4 characters long.');
    else if (lastName.length > 64)
        errorsList.push('The last name must not exceed 64 characters.');

    // Validate email
    if (!email) errorsList.push('Email address is required');
    else if (!validateEmail(email))
        errorsList.push('The email address format is invalid.');
    else if (await UserExists(email)) errorsList.push('This Email is taken');

    // Validate password
    if (!password) errorsList.push('Password is required.');
    else if (
        !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$@#&!]).{8,}$/.test(password)
    )
        errorsList.push(
            'Password must be at least 8 characters long and include a number, an uppercase letter, a lowercase letter, and a special character ($, @, #, &, or !).'
        );

    // Validate phone number
    if (!phoneNumber) errorsList.push('Phone number is required.');
    else if (!validatePhoneNumber(phoneNumber))
        errorsList.push('The phone number format is invalid.');

    return errorsList;
};

export const registerUser = async (req, res) => {
    try {
        const errorsList = await validateUserInput(req.query);

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
