const express = require('express');

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

module.exports = profileRouter;

 