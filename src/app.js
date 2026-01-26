const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.get('/',(req,res)=>{
    console.log("Received a GET Request");
    res.send({FirstName : "Mohd Husain", LastName : "Darji", Age : 24, MobileNo : 7208309120});
})

app.post('/',(req,res)=>{
    console.log("Received a POST Request");
    res.send("GOT the POST");
})

app.patch('/',(req, res) => {
    console.log("Received the PATCH Reqest");
    res.send("GOT the PATCH");
});

app.delete('/',(req,res)=>{
    console.log("Received a DELETE Request");
    res.send("GOT THE DELETE");
})

app.listen(PORT,()=>{
    console.log(`Server is Listening on port ${PORT} Suceessfully ....`);
});
