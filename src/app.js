const express = require("express");
const { homedir } = require("os");
const { error } = require("console");
const connectDB = require("./config.js/database");
const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form data

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
  .then(() => {
    console.log("Database Connection Established Successfully...");
    app.listen(PORT, () => {
      console.log(`Server is Listening on port ${PORT} Suceessfully ....`);
    });
  })
  .catch(() => {
    console.log("Database Connection Failed !");
  });
