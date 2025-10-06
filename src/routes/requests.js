const express = require('express');

const requestRouter = express.Router();
const { authUser } = require('../Middlewares/auth');
const { RequestConnectionModal } = require('../Config/models/connectionRequest');
const User = require('../Config/models/user')

requestRouter.post('/request/send/:status/:userId', authUser , async (req, res) => {

    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;

        const requrestConnection = new RequestConnectionModal({
            fromUserId,
            toUserId,
            status,
        });

        const allowedStatus = ['interested', 'ignored'];
        if(!allowedStatus.includes(status)){
            return res.status(400).send('Invalid status');
        };

        const existingConnectionRequest = await RequestConnectionModal.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        })
        if(existingConnectionRequest){
            return res.status(400).json({
                message: 'Connection request already exists'
            })
        }

        const touser = await User.findById(toUserId);
        if(!touser){
            return res.status(400).json({
                message: 'The User does not exist'
            })
        }

        const savedData = await requrestConnection.save();
        res.json({
            message: 'Connection saved successfully!',
            savedData,
        })

    } catch (err) {
        res.json({
            message: `invalid dataset ${err.message}`,
        })
    }

});

module.exports = requestRouter;