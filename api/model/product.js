const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:String,
    email:String,
    phone:Number,
    gender:String
})

module.exports = mongoose.model('product',productSchema);