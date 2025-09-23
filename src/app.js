const express = require('express');
const {connectDB} = require('./Config/database');
const User = require('./Config/models/user')

const app = express();

app.post('/signup', async (req, res) => {
    const user = new User({
        firstName: 'Sachin',
        lastName: 'T',
        email: 'st@gmail.com',
        age: 45,
        password:'password2',
    })

    await user.save()
    res.send('User Added succesfully');
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
