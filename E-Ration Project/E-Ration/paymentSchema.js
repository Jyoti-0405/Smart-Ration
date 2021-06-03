const mongoose = require('mongoose');
const validator = require('validator');
const paymentSchema = mongoose.Schema({
    customerid : {
        type : String,
    },
    orderid : {
        type : String,
    },
    cardname :{
        type : String,
        required : true,
    },
    cardnumber :{
        type : String,
        required : true,
        validate: {
            validator: function(v) {
                return /^\d{16}$/.test(v);
            },
            message: "Please enter a valid card number"
        },
    },
    month : {
        type : Number,
    },
    year :{
        type : Number,
    },
    price : {
        type : Number,
    },
    currentdate : {
        type : Date,
        default : Date.now(),
    }
})
module.exports = mongoose.model('payments',paymentSchema);