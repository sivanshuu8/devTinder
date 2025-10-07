const express = require('express');
const { RequestConnectionModal } = require('../Config/models/connectionRequest');
const { authUser } = require('../Middlewares/auth');
const User = require('../Config/models/user');

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
});

userRouter.get('/feeds', authUser, async(req, res) => {
    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let pageSize = parseInt(req.query.pageSize) || 10;
        pageSize = pageSize > 50 ? 50 : pageSize;
        const skip = (page - 1) * pageSize;
        
        const connectionRequest = await RequestConnectionModal.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        });

        const hideExistingConnections = new Set();
        connectionRequest.forEach((el) => {
            hideExistingConnections.add(el.fromUserId.toString());
            hideExistingConnections.add(el.toUserId.toString())
        });

        const filteredFeedsData = await User.find({
            _id: { $nin: Array.from(hideExistingConnections), $ne: loggedInUser._id}
        }).select('firstName lastName age skills').skip(skip).limit(pageSize);

        console.log(hideExistingConnections);

        res.status(200).json({
            message: 'Data fetched Succefully!',
            data: filteredFeedsData,
        });

    } catch (err) {
        res.status(400).json({
            message: `Error: ${err.message}`
        })
    }
})


module.exports = userRouter;