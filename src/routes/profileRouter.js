const express = require("express");
const { userAuth } = require("../AuthController/Auth");
const userModel = require("../models/userModel");

const profileRouter = express.Router();

//Profile API
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (error) {
    res.status(401).send(error.message);
  }
});

module.exports = profileRouter;
