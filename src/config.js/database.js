const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://husain:pOqTeMRiyEcM7ll9@project0.fpxlnam.mongodb.net/project0"
  );
};

module.exports = connectDB;



