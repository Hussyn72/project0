const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    FirstName : {
        type : String
    },
    LastName :{
        type : String
    },
    Age : {
        type : Number
    },
    EmailId : {
        type : String
    },
    Password: {
        type : String
    },
    Gender : {
        type : String
    }
});

const userModel = mongoose.model('User',userSchema);

module.exports = userModel;
