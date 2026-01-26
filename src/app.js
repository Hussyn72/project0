const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.get('/',(req,res)=>{
    console.log("Received a GET Request");
    res.end("GOt the GET");
})

app.post('/',(res,req)=>{
    console.log("Received a POST Request");
    res.end("GOT the POST");
})

app.patch('/', (req, res) => {
    console.log("Received the PATCH Reqest");
    res.end("GOT the PATCH");
});

app.delete('/',(res,req)=>{
    console.log("Received a DELETE Request");
    res.end("GOT THE DELETE");
})

app.listen(PORT,()=>{
    console.log(`Server is Listening on port ${PORT} Suceessfully ....`);
});