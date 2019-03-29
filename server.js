const express = require('express')
const app = express()
const serv = require('http').Server(app);
const mongoose = require('mongoose');
const cors = require('cors')
const url = `mongodb://tyler:tyler@127.0.0.1:27017/coffeeshop?authSource=admin`;

const accountSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    password: String
})

const Account = mongoose.model('Account', accountSchema);

var test = new Account({
    _id: new mongoose.Types.ObjectId(),
    name: "test",
    password: "pass"
})

test.save().then(result => {
    console.log(result);
})

Account.find({name:'test'}).then(console.log(doc))

mongoose.connect(url, {useNewUrlParser: true});



serv.listen(80);
app.use(cors());
console.log("Server started.");