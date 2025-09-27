const jwt = require('jsonwebtoken');
const User = require('../Config/models/user')


const authUser = async (req, res, next) => {
    try{
        if(!req.cookies) throw new Error('Invalid Token');
        const { token } = req.cookies;
        if(!token) throw new Error('Invalid Token');
        const decodeToken =  jwt.verify(token, 'MyApp@123');
        if(!decodeToken) throw new Error('Invalid Token');
        const { userId } = decodeToken;
        const userProfile = await User.findById({ _id: userId });
        req.user = userProfile;
        next();
    } catch (err) {
        res.status(400).send('Error : ' + err.message);
    }
};

module.exports = {
    authUser,
};