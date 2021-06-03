const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
    name :{
        type : String,
        required : true,
    },
    mobile :{
        type : String,
        required : true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: "Please enter a valid mobile number"
        },
    },
    email : {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
    },
    cardtype : {
        type : String,
        enum : ['Rice Card','Sugar Card'],
    },
    address : {
        type : String,
        minlength : 10,
        maxlength : 50,
    },
    rationshopno : {
        type : String,
    },
    password :{
        type : String,
        required : true,
    }
})

module.exports = mongoose.model('Users',userSchema);