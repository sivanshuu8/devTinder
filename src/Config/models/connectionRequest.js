const express = require('express');
const mongoose = require('mongoose');

const requrestConnectionSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['interested', 'ignored', 'accepted', 'rejected'],
            message: "{VALUE} is incorrect status type",
        }
    }
}, {
    timestamps: true,
});

requrestConnectionSchema.pre('save', function (next) {
    const requrestConnection = this;
    // Check if the fromUserId is same as touserId
    if(requrestConnection.fromUserId.equals(requrestConnection.toUserId)){
        throw new Error('Cannot send request to yourself');
    }
    next();
})

requrestConnectionSchema.index({ fromUserId: 1, toUserId: 1}); // 1 is ascending, -1 means descending
const RequestConnectionModal = new mongoose.model('requrestConnectionSchema', requrestConnectionSchema);

module.exports = {
    RequestConnectionModal,
}