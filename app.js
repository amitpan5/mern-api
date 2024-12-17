const express = require('express');
const app = express();
const studentRoute = require('./api/routes/product');
const facultyRoute = require('./api/routes/faculty');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const productRoute = require ('./api/routes/product');
const userRoute = require('./api/routes/user');
const fileUpload = require('express-fileupload');

mongoose.connect('mongodb+srv://priti2002:priti%40123@sbs.7kp2l.mongodb.net/');

mongoose.connection.on('error',err=>{
    console.log('connectoin failed');
});

mongoose.connection.on('connected',connected=>{
    console.log('connected with database...');
});

app.use(fileUpload({
    useTempFiles:true
}))



app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/student',studentRoute);
app.use('/faculty',facultyRoute);

app.use('/product',productRoute);
app.use('/user',userRoute);

app.use((req,res,next)=>{
    res.status(404).json({
        error:'bed request'
        
        
    })
})

module.exports = app;