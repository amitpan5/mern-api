const express = require('express');
const routes = express.Router();

routes.get('/',(req,res,next)=>{
    res.status(200).json({
        msg:'this is faculty get request'
    })
})

routes.post('/',(req,res,next)=>{
    res.status(200).json({
        msg:'this is faculty post request'
    })
})
module.exports = routes;