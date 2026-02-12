const express = require("express");

const app = express();

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
