
const express = require('express');

const app = express();

// app.use('/test',(req, res) => {
//     res.send('the test page');
// })

app.get('/test',(req, res) => {
    res.send({firstName:'Sivanshu', lastName:'Singh', profession:'engineer'});
});

app.post('/test',(req, res) => {
    res.send('data saved successfully');
})

app.use((req, res) => {
    res.send('yo bro this is working! your first server!!');
})

app.listen(3001, () => {
    console.log('listining at port 3001');
})