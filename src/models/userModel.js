const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    FirstName : {
        type : String
    },
    LastName :{
        type : String
    },
    Age : {
        type : Number
    }
});

