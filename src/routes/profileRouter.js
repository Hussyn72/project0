const express = require("express");
const { userAuth } = require("../AuthController/Auth");
const { validateProfileUpdateData } = require("../utils/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");

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

//Forgot Password API

module.exports = profileRouter;
