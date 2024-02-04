import express from 'express';
import User from '../../models/User.model.js';

const router = express.Router();


/**
 * Below are working examples of creating a user or retrieving a user.
 */
// router.put('/register', async function (req, res, next) {
//   await User.create({
//     name: 'Lakshman',
//     email: 'Lakshmanchoudhary020@gmail.com',
//     password: 'test',
//     phoneNumber: '1923232222',
//     profilePicture: '',
//   });
//   return res.status(201).json({ status: 'user created successfully' });
// });

// router.get('/user', async function (req, res, next) {
//   const email = req.query.email
//   const user = await User.findAll({
//     where: {
//       email,
//     }
//   })
//   return res.status(201).json({ user });
// });

export default router;
