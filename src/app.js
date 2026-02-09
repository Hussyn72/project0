const express = require("express");
const fs = require("fs");
const { homedir } = require("os");
const { adminAuth } = require("./AuthController/adminAuth");
const { userAuth } = require("./AuthController/userAuth");
const { error } = require("console");
const connectDB = require("./config.js/database");
const userModel = require("./models/userModel");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form data

//SignUp API
app.post("/signup", async (req, res) => {
  //creating a new instance of the USer Model
  console.log(req.body);
  const user = new userModel(req.body);

  //user is a instance of usermodel object.
  //data will be save to database and will return you a promise, because it may take time to insert its a async task and we'll make it async and handle that way only.
  //always handle db thing to try catch block and anything in try catch block to handle the errors gracefully.
  try {
    await user.save();
    res.send("User Added Successfully...");
  } catch (err) {
    res
      .status(400)
      .send("ERror Occured while Inserting the data into db" + err.message);
  }
});

//get one user first by email
app.get("/user", async (req, res) => {
  const Email = req.body.EmailId;
  console.log(Email);
  try {
    const user = await userModel.findOne({ EmailId: Email });
    console.log(user);
    res.status(200).send(user);
  } catch (err) {
    res.status(404).status("User Not Found");
  }
});

//feed API get all the users of db
app.get("/feed", async (req, res) => {
  //get the data from database.
  try {
    const allUser = await userModel.find({});
    console.log(allUser);
    res.send(allUser);
  } catch (err) {
    res.status(404).send("No User Found");
  }
});

//UPDATE API
app.patch("/userupdate", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  console.log(data);
  try {
    const updateUserModel = await userModel.findByIdAndUpdate({_id:userId},data,{
      returnDocument: 'after'
    });
    console.log(updateUserModel);
    res.send("Updated User Successfully.");
  } catch (err) {
    res.status(404).send("User Not Found -> " + err.message);
  }
});

//DELETE API
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    console.log("Got the user ID from request -> ",userId)
    const deleteUser = await userModel.findByIdAndDelete({_id:userId});
    res.status(201).send("User Deleted Successfully ");
  } catch (err) {
    console.log(err);
    res.status(404).send("User Does Not Found");
  }
});

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
