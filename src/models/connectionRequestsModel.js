const mongoose = require("mongoose");

const connectionRequestsSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId, //getting the ID of document.
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["intrested", "ignored", "rejected", "accepted"],
        message: "{VALUE} is not supported",
      },
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

connectionRequestsSchema.mongoose.pre("save", function () {
  const connectionRequest = this;
  //Check if the fromUserId is same as toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You cannot send connection request to yourself");
  }
  next();
});

module.exports = mongoose.model("ConnectionRequests", connectionRequestsSchema);
