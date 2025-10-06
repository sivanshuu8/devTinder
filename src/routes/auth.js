const express = require('express');
const User = require('../Config/models/user');
const { validateSignUp } = require('../Utils/validate');
const bcrypt = require('bcrypt');
const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
    console.log(req.body);
    // const user = new User({
    //     firstName: 'Sachin',
    //     lastName: 'T',
    //     email: 'st@gmail.com',
    //     age: 45,
    //     password:'password2',
    // })

    // try {
    //     await user.save()
    //     res.send('User Added succesfully');
    // } catch (err) {
    //     res.status(400).send('Error saving user:'+ err.message)
    // }
    // const user = new User(req.body);
    try{
        validateSignUp(req.body);
        const {firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        })

        await user.save();  // to save user data   
        res.send('User Added successfully');
    } catch (err) {
        res.status(400).send('Error saving user: '+ err.message )
    }
});

authRouter.post('/login', async (req, res) => {

    try{
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId })
        if(!user){
            throw new Error('Email is Invalid')
        }
        // const isPasswordValid = await bcrypt.compare(password, user.password);
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            console.log(user._id)
            // const token = jwt.sign({ userId: user._id }, 'MyApp@123', { expiresIn: '2d'})
            const token = await user.getJWT();
            res.cookie('token', token, { expires: new Date(Date.now() + 8 * 3600000) });
            res.status(200).send('Login Successful');
        } else {
            throw new Error('Invalid Password')
        }
    } catch (err){
        res.status(400).send('Error : ' + err.message)
    }
});

authRouter.post('/logout', async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now())
        }).send('User logged out');
    } catch (err) {
        throw new Error('Unable to logout');
    }
})

module.exports = authRouter;

