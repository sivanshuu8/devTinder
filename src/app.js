
const express = require('express');

const app = express();

// app.use('/test',(req, res) => {
//     res.send('the test page');
// })

//using patterns in routes, here es is optional, we can also write regax in the route
// app.get('/t(es)?t',(req, res) => {
//     res.send({firstName:'Sivanshu', lastName:'Singh', profession:'engineer'});
// });

app.get('/test/:userID/:name',(req, res) => {
    console.log(req.params);
    //{ userID: '111', name: 'sivanshu' }
    res.send({firstName:'Sivanshu', lastName:'Singh', profession:'engineer'});
});

//reading request params
// app.get('/test',(req, res) => {
//     console.log(req.query);
//     res.send({firstName:'Sivanshu', lastName:'Singh', profession:'engineer'});
// });

app.post('/test',(req, res) => {
    res.send('data saved successfully');
})

app.use((req, res) => {
    res.send('yo bro this is working! your first server!!');
})

app.listen(3001, () => {
    console.log('listining at port 3001');
})