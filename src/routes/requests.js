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

        const allowedStatus = ['interested', 'ignored', 'accepted'];
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

requestRouter.post('/request/review/:status/:requestId', authUser, async (req, res) => {

    try{

        const loggedInUser = req.user
        const { status, requestId } = req.params;

        const connectionRequest = await RequestConnectionModal.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        });

        if(!connectionRequest) {
            return res.status(404).json({ message: `Connection request failed : ${err.message}`})
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.status(200).json({
            message: 'Connection established successfully',
            data,
        })


         
    } catch (err) {
        res.status(400).json({ message: `Error : ${err}`})
    }
});

module.exports = requestRouter;