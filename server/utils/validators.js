import User from '../models/User.model.js';

export function validateEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

export async function UserExists(email) {
    try {
        const user = await User.findOne({ where: { email } });
        return user !== null;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error checking if user exists:', error);
        return false;
    }
}

export function validatePhoneNumber(input_str) {
    const re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    return re.test(input_str);
}

export const validateUserInputs = async ({
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
