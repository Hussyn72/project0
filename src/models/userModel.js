const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: true,
      unique: true,
      index: true,
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
      default:
        "https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo URL");
        }
      },
    },
    about: {
      type: String,
      maxlength: [200, "Maximum length for about is 200 characters"],
    },
    skills: {
      type: [String],
    },
    resetOTP: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    isOTPverified: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ FirstName: 1, LastName: 1 });

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "SadluTuhai@chaiwala", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (PasswordEnteredByUser) {
  const user = this;
  const hashedPassword = user.Password;

  const isPasswordCorrect = bcrypt.compare(
    PasswordEnteredByUser,
    hashedPassword,
  );
  return isPasswordCorrect;
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
