const mongoose = require('mongoose');
const validator = require('validator');

const orderSchema = mongoose.Schema({
    customerid : {
        type : String,
    },
    product : {
        type : String,
    },
    paid : {
        type : Boolean,
    },
    currentdate : {
        type : Date,
        default : Date.now(),
    }
})

module.exports = mongoose.model('orders',orderSchema);