const express = require("express");
const fs = require("fs");
const { homedir } = require("os");
const { userAuth } = require("./AuthController/Auth");
const { error } = require("console");
const connectDB = require("./config.js/database");
const userModel = require("./models/userModel");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // for form data

//SignUp API
app.post("/signup", async (req, res) => {
  try {
    const { FirstName, LastName, Age, Password, Gender, EmailId } = req.body;

    const userExist = await userModel.findOne({ EmailId: EmailId });
    if (userExist) {
      return res.status(409).send("User Already Exists");
    }

    //validation of data
    validateSignUpData(req);

    //encrypt the password
    const hashedPassword = await bcrypt.hash(Password, 10);

    //creating new instances of use model
    const user = new userModel({
      FirstName,
      LastName,
      EmailId,
      Password: hashedPassword,
      Age,
      Gender,
    });
    await user.save();
    res.status(200).json({ message: "User Created Successfully", user });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "user already exists" });
    }
    res.status(400).json({ error: error.message });
  }
});

//Login API
app.post("/login", async (req, res) => {
  try {
    const { EmailId, Password } = req.body;
    const userExists = await userModel.findOne({ EmailId: EmailId });
    if (!userExists) {
      console.log("User Email is not present in the Database");
      res.status(404).send("User Not Found");
    } else {
      const isPasswordCorrect = await userExists.validatePassword(Password);
      if (isPasswordCorrect) {
        //Create JWT Token
        const token = await userExists.getJWT();

        //Add the token to cookie and send the response back to user
        res.cookie("JWTToken", token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }); //7 days
        res.status(200).send("Logged In Successfully");
      } else {
        res.status(400).send("Password is not Correct");
      }
    }
  } catch (error) {
    res.status(400).send("Login Failed ! " + error.message);
  }
});

//Profile API
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (error) {
    res.status(401).send(error.message);
  }
});

//sendConnectionrequest API
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
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
    const updateUserModel = await userModel.findByIdAndUpdate(
      { _id: userId },
      data,
      {
        returnDocument: "after",
      },
    );
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
    console.log("Got the user ID from request -> ", userId);
    const deleteUser = await userModel.findByIdAndDelete({ _id: userId });
    res.status(201).send("User Deleted Successfully ");
  } catch (err) {
    console.log(err);
    res.status(404).send("User Does Not Found");
  }
});

//needs attention here will do it later.
app.patch("/user/:id", async (req, res) => {
  try {
    const allowedUpdates = [
      "FirstName",
      "LastName",
      "age",
      "gender",
      "photoURL",
    ];
    const updates = Object.keys(req.body);

    const isValid = updates.every((field) => allowedUpdates.includes(field));

    if (!isValid) {
      return res.status(400).json({ error: "Invalid update fields" });
    }

    // Data sanitization
    if (req.body.name) req.body.name = req.body.name.trim();

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/logout", (req, res) => {
  //add a check here if the user is authenticated or not and then clear the cookie
  if (!req.cookies.JWTToken) {
    return res.status(401).send("Login First to Logout");
  }

  res.clearCookie("JWTToken");
  res.status(200).send("Logged Out Successfully");
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
