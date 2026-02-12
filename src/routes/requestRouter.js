const express = require("express");
const { userAuth } = require("../AuthController/Auth");
const userModel = require("../models/userModel");

const requestRouter = express.Router();

//sendConnectionrequest API
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    res
      .status(200)
      .send(
        `${req.user.FirstName} You have sent the COnnection request Successfully`,
      );
  } catch (error) {
    res.status(400).send("Bad Request");
  }
});

module.exports = requestRouter;
