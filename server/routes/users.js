import express from 'express';
import { registerUser } from '../controllers/User.controller.js';

const router = express.Router();

router.put('/register', registerUser);

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
