const express = require("express");
const userModel = require("../models/userModel");
const connectionRequest = require("../models/connectionRequestsModel");
const { userAuth } = require("../AuthController/Auth");

const userRouter = express.Router();

const USER_SAFE_DATA = "FirstName LastName photoURL Age Gender about skills";

//FEED - Get All Users
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    //all user accept logged in user.
    //user once ignore should not come again.
    //already connected users should not come again.
    //user I have already sent the connection request.
    //so we did a query to find all the connections and removed it from our main get users query and used that as a filter.
    const connections = await connectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUsedId: loggedInUser._id }],
    });
    const hideFromUserFeed = new Set();
    connections.forEach((req) => {});

    const users = await userModel
      .find({
        $and: [
          { _id: { $nin: Array.from(connections) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      })
      .select(USER_SAFE_DATA);

    res.status(200).json({ message: "All Users Fetched Successfully", users });
  } catch (error) {
    res.status(400).json({ "Error :": error.message });
  }
});

//Request - get all Connection Requests receives
userRouter.get("/allRequests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const allRequests = await connectionRequest
      .find({
        toUserId: loggedInUser._id,
        status: "intrested",
      })
      //.populate("fromUserId",["FirstName","LastName"]);
      .populate(
        "fromUserId",
        USER_SAFE_DATA,
        // "FirstName LastName PhotoURL age Gender about Skills",
      );
    res.status(200).json({ message: "All the Requests", allRequests });
  } catch (error) {
    res.status(400).json({ "Error:": error.message });
  }
});

//Connections - get all connections
userRouter.get("/allConnections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await connectionRequest
      .find({
        $or: [{ toUsedId: loggedInUser._id }, { fromUserId: loggedInUser }],
        status: "accepted",
      })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connections.map((row) => {
      //getting the insider array of fromUserId column. returning by checking the loggedin perspective.
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.status(200).json({ message: "Your ALL Connections ", data });
  } catch (error) {
    res.status(400).json({ "Error :": error.message });
  }
});

module.exports = userRouter;
