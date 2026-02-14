const express = require("express");
const { userAuth } = require("../AuthController/Auth");
const { validateProfileUpdateData } = require("../utils/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const nodemailer = require("nodemailer");
const { propfind } = require("./authRouter");

const profileRouter = express.Router();

//Profile API
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (error) {
    res.status(401).send(error.message);
  }
});

//Update Profile API
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isValid = validateProfileUpdateData(req);
    if (!isValid) {
      throw new Error("Invalid Edit Request");
    }

    // const loggedInUser = req.user;
    // const update = Object.keys(req.body).forEach((field) => {
    //   loggedInUser[field] = req.body[field];
    // });
    // await loggedInUser.save();
    // res
    //   .status(200)
    //   .json({ message: "Profile Updated Sucessfully", user: loggedInUser });

    const loggedInUser = req.user;
    //This will be giving all the keys of the request-jo user se aari hai wo body object
    const updates = Object.keys(req.body);

    //will take each key of req.body thats why using forEach. And check it will loggedInUser Field and assign them the req.body-field eg if user has age field it will be replaced by req.body's age field.
    updates.forEach((field) => {
      loggedInUser[field] = req.body[field];
    });

    //and then we will save the loggedinUser. as it has the updated values assigned to it now.
    await loggedInUser.save();
    res
      .status(200)
      .json({ message: "Profile updated Successfully ", user: loggedInUser });
  } catch (error) {
    res.json({ message: error.message });
  }
});

//Change Password API
profileRouter.patch("/profile/change-password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const currentHashedPassword = loggedInUser.Password;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new Error("Both Password are Required");
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      currentHashedPassword,
    );
    if (!isCurrentPasswordValid) {
      throw new Error("Current Password is Incorrect");
    }

    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("New Password is weak. Enter the Strong Password");
    }
    const isPasswordSame = await bcrypt.compare(
      newPassword,
      currentHashedPassword,
    );
    if (isPasswordSame) {
      throw new Error("Password Cannot be same as previous password");
    }
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    loggedInUser.Password = newHashedPassword;
    await loggedInUser.save();
    res.status(200).json({ message: "Password Updated Successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//Forgot Password API - WORK IN PROGRESS
profileRouter.post("/profile/forgot-password", async (req, res) => {
  try {
    const userEmailId = req.body.EmailId;
    if (!userEmailId) {
      return res.status(400).json({ message: "Please Enter Email Address" });
    }

    const isUserExist = await userModel.findOne({ EmailId: userEmailId });
    if (!isUserExist) {
      return res
        .status(404)
        .json({ message: "User Not Found with this Email" });
    }

    //now generate a random number and
    const OTP = String(Math.floor(100000 + Math.random() * 900000));

    isUserExist.resetOTP = OTP;
    isUserExist.otpExpiry = Date.now() + 10 * 60 * 1000; //10minutes
    await isUserExist.save();

    //store it and send it to user on email and provide him a textbox to enter the otp.
    // 1. Create a transporter object using your email service's SMTP details
    const transporter = nodemailer.createTransport({
      service: "gmail", // or any other email provider like Outlook, Yahoo, etc.
      auth: {
        user: "Test@gmail.com",
        pass: "TestTestest", // Use an app password for security
      },
    });

    // 2. Define the email options
    const mailOptions = {
      from: '"Your Boss" <Test@gmail.com>', // sender address
      to: "Client@gmail.com", // list of receivers
      subject: "Password Reset OTP", // Subject line
      //text: "This is the plain text body of the email.", // plain text body
      html: `<p>Hello ${isUserExist.FirstName},</p><br><p>Your One Time Password is <b>${OTP}</b></p><br><p>Your OTP will be valid for 10 minutes.<br><br>Thanks & Regards</p>`, // html body
    };

    // 3. Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      //console.log("Message sent: %s", info.messageId);
    });

    res.status(200).json({ message: `OTP Sent Successfully` });
  } catch (error) {
    res.status(400).json({ ERROR: error.message });
  }
});

profileRouter.post("/profile/verify-otp", async (req, res) => {
  try {
    const userEnteredOTP = req.body.OTP;
    const userEmailId = req.body.EmailId;
    if (!userEmailId) {
      return res.status(400).json({ message: "Please Enter Email Address" });
    }

    const isUserExist = await userModel.findOne({ EmailId: userEmailId });
    if (!isUserExist) {
      return res
        .status(404)
        .json({ message: "User Not Found with this Email" });
    }

    if (!userEnteredOTP) {
      return res.send("Please Enter OTP");
    }
    if (userEnteredOTP.length !== 6) {
      return res.send("Please Enter Valid OTP");
    }

    //if otp matches then allow him to set the new password and store that password in db.
    if (userEnteredOTP !== isUserExist.resetOTP) {
      return res.status(409).json({ message: "Incorrect OTP" });
    }

    if (isUserExist.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP Expired" });
    }

    isUserExist.isOTPverified = true;
    await isUserExist.save();
    res
      .status(200)
      .json({ message: "OTP Verified Please reset Your Password" });
  } catch (error) {
    res.status(400).json({ ERROR: error.message });
  }
});

profileRouter.post("/profile/reset-Password", async (req, res) => {
  try {
    //allow user to reset the password and store the new password in db.
    const newPassword = req.body.newPassword;
    const userEmailId = req.body.EmailId;
    const isUserExist = await userModel.findOne({ EmailId: userEmailId });
    if (!isUserExist) {
      return res
        .status(404)
        .json({ message: "User Not Found with this Email" });
    }

    const isOTPverified = isUserExist.isOTPverified;
    if (!isOTPverified) {
      return res.status(400).json({ message: "OTP is not verified" });
    }

    console.log(newPassword);
    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({
        message: "New Password is weak. Enter the Strong Password",
      });
    }
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    isUserExist.Password = newHashedPassword;
    isUserExist.resetOTP = null;
    isUserExist.otpExpiry = null;
    isUserExist.isOTPverified = null;
    await isUserExist.save();
    return res.status(200).json({ message: "Password Reset Successfully" });
  } catch (error) {
    res.status(400).json({ ERROR: error.message });
  }
});

module.exports = profileRouter;
