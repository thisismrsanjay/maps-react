const mongoose = require('mongoose');

var dataSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,

    },
    message:{
        type:String,
        required:true,

    },
    latitude:{
        type:String,
        required:true,

    },
    longitude:{
        type:String,
        required:true
    },
    date:{
        type:String
    }

})









module.exports = mongoose.model('Data',dataSchema);