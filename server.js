const express = require('express')
const app = express()
const serv = require('http').Server(app);
const mongoose = require('mongoose');
const cors = require('cors')
const url = `mongodb://tyler:tyler@127.0.0.1:27017/coffeeshop?authSource=admin`;

mongoose.connect(url, {useNewUrlParser: true});

serv.listen(80);
app.use(cors());
console.log("Server started.");