const express = require("express");
const fs = require("fs");
const { homedir } = require("os");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form data

app.get("/user/:id/orderid/:orderid", (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server is Listening on port ${PORT} Suceessfully ....`);
});
