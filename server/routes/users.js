import express from 'express';
import User from '../../models/User.model.js';

const router = express.Router();
function validateEmail(email){
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

async function UserExists(email){
    try {
        const user = await User.findOne({ where: { email } });
        return user !== null;
    } catch (error) {
        console.error('Error checking if user exists:', error);
        return false;
    }
};
function validatePhoneNumber(input_str) {
    var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  
    return re.test(input_str);
  }

router.put('/register', async function (req, res, next) {
    try {
        const {name, email, password, phoneNumber} = req.query;
        const errorsList = [];
        if(name){
            if(name.length < 4){
                errorsList.push('The name is too short')
            }
            if(name.length > 64){
                errorsList.push('The name is too long')
            }
        }else{
            errorsList.push('Name is requried')
        }
        if(email){
            if(!validateEmail(email)){
                errorsList.push('This Emil address is invalid')
            }
            if(await UserExists(email)){
                errorsList.push('This Email is taken')
            }

        }else{
            errorsList.push('Email address is required')
        }
        if(password){
            var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$@#&!]).{8,}$/;
            if(!regex.test(password)){
                errorsList.push('Password is not strong')
            }

        }else{
            errorsList.push('Password is requied')
        }
        if(phoneNumber){
            if(!validatePhoneNumber(phoneNumber)){
                errorsList.push('Invalid phone Number')
            }
        }else{
            errorsList.push('Phone is required')
        }

        if(errorsList.length ==0){
            // TODO: Add validations and return proper errors.
            await User.create({
                name: 'Lakshman',
                email: 'Lakshmanchoudhary020@gmail.com',
                password: 'test',
                phoneNumber: '1923232222',
                profilePicture: '',
            });
            return res.status(201).json({
                "errors": [],
                "data": {
                  "status": "User created successfully"
                }
              });
        }else{
            return res.status(500).json({
                "errors": errorsList,
                "data": {
                  "status": "User not created"
                }
              })
        }
        
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({
            "errors": ["A technical error has occurred"],
            "data": {
              "status": "User not created"
            }
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
