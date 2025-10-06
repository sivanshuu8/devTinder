const express = require('express');
const validdateEditProfile = require('../Utils/validate')

const profileRouter = express.Router();
const { authUser } = require('../Middlewares/auth');

profileRouter.get('/profile', authUser, async(req, res) => {
    try{
        const user = req.user;
        if(!user) throw new Error('User Not Found')
        res.status(200).send(user);
    } catch (err) {
        console.log(err);
    }
});

profileRouter.patch('/profile', authUser,  async (req, res) => {
    try {
        if(!validdateEditProfile(req)){
            throw new Error('Invalid dataset');
        };
        const loggedUser = req.body;
        Object.keys(req.body).forEach((el) => {
            loggedUser[key] = req.body[key];
        });
        res.status(200).send(`${loggedUser.firstName} your data is updated`);
    } catch (err) {
        res.status(200).send('Error:' + err.message);
    }
})

module.exports = profileRouter;

 