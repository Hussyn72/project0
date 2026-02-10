//creating a new instance of the USer Model
  /*console.log(req.body);
  const user = new userModel(req.body);*/

  //user is a instance of usermodel object.
  //data will be save to database and will return you a promise, because it may take time to insert its a async task and we'll make it async and handle that way only.
  //always handle db thing to try catch block and anything in try catch block to handle the errors gracefully.
  /*try {
    await user.save();
    res.send("User Added Successfully...");
  } catch (err) {
    res
      .status(400)
      .send("ERror Occured while Inserting the data into db" + err.message);
  }*/