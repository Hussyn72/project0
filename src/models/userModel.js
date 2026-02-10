const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: true,
      // "First Name is Required Please Enter First Name"],
      trim: true,
      minlength: [4, "minimum length for First Name is 3"],
      maxlength: [20, "maximum length for First Name is 10"],
    },
    LastName: {
      type: String,
      //   required: true,
      //   trim: true,
      //   minlength: [3, "minimum length for Last Name is 3"],
      //   maxlength: [10, "maximum length for Last Name is 10"],
    },
    Age: {
      type: Number,
      required: [true, "Age is required field"],
      min: 18,
      max: [70, "You are too old for this to register"],
      trim: true,
      default: 18,
    },
    EmailId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email address : " + value);
        }
      },
    },
    Password: {
      type: String,
      required: true,
      //, "password is required"],
      minlength: [6, "minimum password length is 6"],
    },
    Gender: {
      type: String,
      required: [true, "please enter gender"],
      trim: true,
      lowercase: true,
      validate(value) {
        if (!["male", "female"].includes(value)) {
          throw new Error("Gender Must be male or female");
        }
      },
    },
    photoURL: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo URL");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
