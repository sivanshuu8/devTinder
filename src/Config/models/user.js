const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        maxLength: 50,
        trim: true,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
    },
    age: {
        type: Number,
        min: 18,
        max: 80,
    },
    gender: {
        type: String,
        validate(value) {
            if(!['male','female', 'others'].includes(value)){
                throw new Error('Enter a valid gender')
            }
        }
    },
    skills: {
        type: Array,
    },
}, {timestamps: true} );

const User = mongoose.model("User", userSchema);

module.exports = User;