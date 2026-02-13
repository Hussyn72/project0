const express = require("express");
const userModel = require("../models/userModel");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const authRouter = express.Router();
authRouter.use(cookieParser());

//SignUp API
authRouter.post("/signup", async (req, res) => {
  try {
    const { FirstName, LastName, Age, Password, Gender, EmailId } = req.body;

    const userExist = await userModel.findOne({ EmailId: EmailId });
    if (userExist) {
      return res.status(409).send("User Already Exists");
    }

    //validation of data
    validateSignUpData(req);

    //encrypt the password
    const hashedPassword = await bcrypt.hash(Password, 10);

    //creating new instances of use model
    const user = new userModel({
      FirstName,
      LastName,
      EmailId,
      Password: hashedPassword,
      Age,
      Gender,
      about,
      skills,
      photoURL,
    });
    await user.save();
    res.status(200).json({ message: "User Created Successfully", user });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "user already exists" });
    }
    res.status(400).json({ error: error.message });
  }
});

//Login API
authRouter.post("/login", async (req, res) => {
  try {
    const { EmailId, Password } = req.body;
    const userExists = await userModel.findOne({ EmailId: EmailId });
    if (!userExists) {
      console.log("User Email is not present in the Database");
      res.status(404).send("User Not Found");
    } else {
      const isPasswordCorrect = await userExists.validatePassword(Password);
      if (isPasswordCorrect) {
        //Create JWT Token
        const token = await userExists.getJWT();

        //Add the token to cookie and send the response back to user
        res.cookie("JWTToken", token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }); //7 days
        res.status(200).send("Logged In Successfully");
      } else {
        res.status(400).send("Password is not Correct");
      }
    }
  } catch (error) {
    res.status(400).send("Login Failed ! " + error.message);
  }
});

//logout API
authRouter.post("/logout", (req, res) => {
  //add a check here if the user is authenticated or not and then clear the cookie
  // if (!req.cookies.JWTToken) {
  //   return res.status(401).send("Login First to Logout");
  // }
  res.cookie("JWTToken", null, { expires: new Date(Date.now()) });

  //res.clearCookie("JWTToken");
  res.status(200).send("Logged Out Successfully");
});

module.exports = authRouter;
