import express from 'express';
import User from '../../models/User.model.js';
import {
    validateEmail,
    validatePhoneNumber,
    UserExists,
} from '../utils/validators.js';
const router = express.Router();

router.put('/register', async function (req, res) {
    try {
        const { name, email, password, phoneNumber } = req.query;
        const errorsList = [];
        if (name) {
            if (name.length < 4) {
                errorsList.push('The name is too short');
            }
            if (name.length > 64) {
                errorsList.push('The name is too long');
            }
        } else {
            errorsList.push('Name is requried');
        }
        if (email) {
            if (!validateEmail(email)) {
                errorsList.push('This Emil address is invalid');
            }
            if (await UserExists(email)) {
                errorsList.push('This Email is taken');
            }
        } else {
            errorsList.push('Email address is required');
        }
        if (password) {
            const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$@#&!]).{8,}$/;
            if (!regex.test(password)) {
                errorsList.push('Password is not strong');
            }
        } else {
            errorsList.push('Password is requied');
        }
        if (phoneNumber) {
            if (!validatePhoneNumber(phoneNumber)) {
                errorsList.push('Invalid phone Number');
            }
        } else {
            errorsList.push('Phone is required');
        }

        if (errorsList.length == 0) {
            await User.create({
                name: 'Lakshman',
                email: 'Lakshmanchoudhary020@gmail.com',
                password: 'test',
                phoneNumber: '1923232222',
                profilePicture: '',
            });
            return res.status(201).json({
                errors: [],
                data: {
                    status: 'User created successfully',
                },
            });
        } else {
            return res.status(500).json({
                errors: errorsList,
                data: {
                    status: 'User not created',
                },
            });
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error creating user:', error);
        return res.status(500).json({
            errors: ['A technical error has occurred'],
            data: {
                status: 'User not created',
            },
        });
    }
});

// example of retrieving a user.
// router.get('/user', async function (req, res, next) {
//     const email = req.query.email
//     const user = await User.findAll({
//         where: {
//             email,
//         }
//     })
//     return res.status(201).json({ user });
// });

export default router;
