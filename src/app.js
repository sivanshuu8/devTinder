const express = require('express');
const {connectDB} = require('./Config/database');
const User = require('./Config/models/user');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/requests');
const userRouter = require('./routes/user');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);


app.get('/user', async (req, res) => {
    const userEmail = req.body.emailId;

    try{
        const users = await User.find({ emailId: userEmail });
        if(users.length === 0){
            res.status(404).send('user not found');
        } else {
            res.send(users);
        }
        
    } catch(err) {
        res.status(400).send('Something went wrong' + err.message);
    }
});

app.get('/feeds', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        res.status(400).send('Something went wrong');
    }
});

app.delete('/user', async (req, res) => {
    const userId = req.body.userId;
    try{
        console.log(userId);
        const a = await User.findByIdAndDelete(userId);
        console.log(a);
        res.send('User Deleted Successfully');
    } catch(err) {
        res.send('Error deleting user');
    }
});

app.patch('/user', async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try{
         const allowedData = ["userId", "age", "skills", "gender", "emailId", "password", "lastName"];
         const isDataValid =  Object.keys(data).every((el) => {
            return allowedData.includes(el);
         })
         if(!isDataValid){
            res.status(400).send('invalid fields!');
         }
         if(data.skills.length >= 10){
            res.status(200).send('Skills excedding limits');
         }
        await User.findByIdAndUpdate({ _id: userId}, data, { runValidators: true });
        res.status(200).send('User updated successfully');
    } catch(err){
        res.status(400).send('User cannot be updated', err.message)
    }
})

connectDB().
then(() => {
    console.log('Database connected');
    app.listen(3000, () => {
    console.log('Server connection established');
    })
})
.catch(() => {
    console.error('error connecting database');
})
