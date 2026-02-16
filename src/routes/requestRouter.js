const express = require("express");
const { userAuth } = require("../AuthController/Auth");
const ConnectionRequest = require("../models/connectionRequestsModel");
const userModel = require("../models/userModel");

const requestRouter = express.Router();

//sendConnectionrequest API
requestRouter.post(
  "/requests/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const loggedinUser = req.user;
      const status = req.params.status;
      const toUserId = req.params.userId;
      const fromUserId = loggedinUser._id;

      const allowedStatus = ["intrested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Status is not supported " + status });
      }

      const isConnectionExists = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (isConnectionExists) {
        return res.status(202).json({ message: "Connection Already Exists" });
      }

      const isToUserExist = await userModel.findById({
        _id: toUserId,
      });
      if (!isToUserExist) {
        return res.status(404).json({ message: "User Not Found" });
      }

      //this we prevented here but can also be done using pre function on schema level pre is the function which triggers before the query execution. and does the job.
      if (fromUserId.toString() === toUserId.toString()) {
        return res
          .status(400)
          .json({ message: "You cannot send connection request to yourself" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.status(200).json({
        message: `${req.user.FirstName} You are ${status}  in ${isToUserExist.FirstName}`,
        data,
      });
    } catch (error) {
      res.status(400).json({ Error: error.message });
    }
  },
);

//request Review
requestRouter.post(
  "/request/review/:status/:requesId",
  userAuth,
  async (req, res) => {
    try {
      const loggedinUser = req.user;
      const requesId = req.params.requesId;
      const status = req.params.status;

      //pass the allowed status from this api
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Status is not supported " + status });
      }

      //only the touserId LoggedIn user should Accept or reject.
      //status should be intrested only for review.
      //requestID should be valid.
      const connectionRequestVerify = await ConnectionRequest.findById({
        _id: requesId,
        toUserId: loggedinUser._id,
        status: "intrested",
      });

      connectionRequestVerify.status = status;
      const data = await connectionRequestVerify.save();
      res
        .status(200)
        .json({ message: "Connection updated Successfully", data });
    } catch (error) {
      res.status(400).json({ Error: error.message });
    }
  },
);
module.exports = requestRouter;
