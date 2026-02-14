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

module.exports = mongoose.model("ConnectionRequests", connectionRequestsSchema);
