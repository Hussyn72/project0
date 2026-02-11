const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const userAuth = async (req, res, next) => {
  try {
    //Read the token from req cookies
    const { JWTToken } = req.cookies;
    if (!JWTToken) {
      throw new Error("Invalid Token !!!!");
    }

    //validate the token
    const isTokenValid = await jwt.verify(JWTToken, "SadluTuhai@chaiwala");
    const { _id } = isTokenValid;

    //find the user
    const user = await userModel.findById({ _id: _id });
    if (!user) {
      throw new Error("User not Found");
    }

    //attaching the userobject with the request now.
    req.user = user;
    next();
  } catch (error) {
    res.send(error.message);
  }
};

module.exports = { userAuth, };
