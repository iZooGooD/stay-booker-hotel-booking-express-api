import User from '../../models/User.model.js';
import {
    validateEmail,
    validatePhoneNumber,
    UserExists,
} from '../utils/validators.js';

const validateUserInput = async ({ name, email, password, phoneNumber }) => {
    const errorsList = [];

    // Validate name
    if (!name) errorsList.push('Name is required');
    else if (name.length < 4)
        errorsList.push('The name must be at least 4 characters long.');
    else if (name.length > 64)
        errorsList.push('The name must not exceed 64 characters.');

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
                name: req.query.name,
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
