const mongoose = require('mongoose');
const validator = require('validator');

const stockSchema = mongoose.Schema({
    stockname : {
        type : String,
    },
    quantity : {
        type : Number,
    }
})

module.exports = mongoose.model('stocks',stockSchema);