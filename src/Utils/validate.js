const validator = require('validator');

const validateSignUp = (req) => {
    const {firstName, lastName, emailId, password } = req;

    if(!firstName || !lastName){
        throw new Error('Please enter a valid Name');
    } else if(!emailId){
        throw new Error('Please Enter a valid Email address')
    } else if(!password){
        throw new Error('Please Enter a valid Password');
    } else if (!validator.isEmail(emailId)) {
        throw new Error('Please Enter a valid Email address')
    } else if (!validator.isStrongPassword(password)) {
        throw new Error('Please Enter a valid Password')
    }
};

const validdateEditProfile = (req) => {
    const allowedData = ["userId", "age", "skills", "gender", "emailId", "password", "lastName"];
    const isDataValid = Object.keys(req.body).every((el) => {
        return allowedData.includes(el);
    })
    return isDataValid;
}
module.exports = {
    validateSignUp,
    validdateEditProfile,
};