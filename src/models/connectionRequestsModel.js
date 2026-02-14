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

//creating a compound index 1 means ascending -1 means descending.compound index means collabing muliple columns
connectionRequestsSchema.index({ fromUserId: 1, toUserId: 1 });

//before saving this function will be call.
connectionRequestsSchema.mongoose.pre("save", function () {
  const connectionRequest = this;
  //Check if the fromUserId is same as toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You cannot send connection request to yourself");
  }
  next();
});

module.exports = mongoose.model("ConnectionRequests", connectionRequestsSchema);
