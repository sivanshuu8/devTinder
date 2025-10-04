const express = require('express');

const requestRouter = express.Router();

requestRouter.get('/connectionRequest', (req, res) => {
    const user = req.user;
    console.log('send connnection request');
    res.send(user.firstName + "sent you a connection request");
});

module.exports = requestRouter;