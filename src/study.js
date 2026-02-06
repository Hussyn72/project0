const express = require("express");
const app = express();
const {adminAuth} = require("./AuthController/adminAuth");
const {userAuth} = require("./AuthController/userAuth");
const PORT = "3000";

//Handle Auth Middleware for only Admin GET, POST,.... Request.
app.use("/admin", adminAuth);
app.use("/user", userAuth);

//GET ALL DATA
app.get("/admin/getAllData", (req, res) => {
  res.send("GET ALL DATA");
});

//DELETE ALL DATA
app.delete("/admin/deleteUser", (req, res) => {
  res.send("Data Deleted");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Error Got Caught");
  }
});

//SIGN-UP /LOGIN
app.post("/user/login", (req, res) => {
  //try{
  throw new error("xyz");
  // }catch(e){
  //   res.status(550).send("pakda mai error")
  // }
  res.send("User Logged In Successfully.");
});

//WAY of error Handling it will go in the last its called wild card error handling - always use
//try catch.
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Error Got Caught - Phirse");
  }
});

//STUDY
app.get("/user/:id/orderid/:orderid", userAuth, (req, res) => {
  console.log("Received a GET Request");
  res.status(201).send({
    params: req.params,
    query: req.query,
    data: {
      OrderId: req.params.orderid,
      paramsID: req.params.id,
      FirstName: "Mohd Husain",
      LastName: "Darji",
      Age: 24,
      MobileNo: 7208309120,
      id: req.query.id,
      url: req.url,
      fullurl: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
      onlypath: `${req.originalUrl}`,
      reqBody: `${JSON.stringify(req.body)}`,
      reqCookie: `${req.cookies}`,
      reqMethod: `${req.method}`,
      reqHost: `${req.host}`,
      reqHostname: `${req.hostname}`,
      reqIP: `${req.ip}`,
    },
    flag: "Received a GET Request",
  });
});

app.post("/", (req, res) => {
  console.log("Received a POST Request");
  res.send(req.params);
  res.send(req.query);
  res.send("GOT the POST");
});

app.post("/user/:id/orderid/:orderid", (req, res) => {
  console.log("Received a POST Request");
  // res.send(req.params);
  res.send({ body: req.body, test: "dekhte hai aata hai ki nahi" });
  //   res.send("GOT the POST");
});

app.patch("/", (req, res) => {
  console.log("Received the PATCH Reqest");
  res.send(req.params);
  res.send(req.query);
  res.send("GOT the PATCH");
});

app.delete("/", (req, res) => {
  console.log("Received a DELETE Request");
  res.send(req.params);
  res.send(req.query);
  res.send("GOT THE DELETE");
});


app.listen(PORT,()=>{
    console.log(`Server is Listening to ${PORT} Port Sucessfully...`)
})