const express = require('express');
const { RequestConnectionModal } = require('../Config/models/connectionRequest');
const { authUser } = require('../Middlewares/auth');

const userRouter = express.Router();

userRouter.get('/user/request/recieved', authUser, async (req, res) => {
    try{

        const loggedInUser = req.user;
        const connectionRequests = await RequestConnectionModal.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate("fromUserId", ['firstName', 'lastName']);

        if(!connectionRequests) throw new Error('Invalid request');

        res.status(200).json({
            message: 'Data fetched Successfully!',
            data: connectionRequests,
        })


    } catch (err) {
        res.status(400).json({
            message: `Error : ${err.message}`,
        })
    }
});

userRouter.get('/user/request/connections', authUser, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequests = await RequestConnectionModal.find({
            $or: [
                {toUserId: loggedInUser._id, status:'accepted'},
                {fromUserId: loggedInUser._id, status: 'accepted'},
            ]
        }).populate('fromUserId', 'firstName lastName',)
        .populate('toUserId', 'firstName lastName')
        const data = connectionRequests.map((el) => {
            if(el.fromUserId.toString() === loggedInUser._id.toString()){
                return el.toUserId;
            }
            return el.fromUserId;
        });
        res.status(200).json({
            message: 'Data fetched successfully!',
            data,
        })
    } catch (err) {
        res.status(400).json({
            message: `Error : ${err.message}`,
        })
    }
})

module.exports = userRouter;