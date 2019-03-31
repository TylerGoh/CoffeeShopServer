const moment = require('moment-timezone');
const express = require('express')
const app = express()
const serv = require('http').Server(app);
const mongoose = require('mongoose');
const cors = require('cors')
const url = `mongodb://tyler:tyler@127.0.0.1:27017/coffeeshop?authSource=admin`;
const io = require('socket.io')(serv, {});


mongoose.connect(url, {useNewUrlParser: true});
serv.listen(80);
app.use(cors());
console.log("Server started.");



var isValidPassword = function (data, cb) {
    Account.find({ name:data.name, password:data.password }).then(doc => {
        if (doc.length > 0)
            cb(true);
        else
            cb(false);})
};


var isUsernameTaken = function (data, cb) {
    Account.find({ username: data.username }).then(doc => {
        if (doc.length > 0)
            cb(true);
        else
            cb(false);})
};

var addUser = function (data, cb) {
    new Account({
        _id: new mongoose.Types.ObjectId(),
        name: data.name,
        password: data.password,
    })
};


SOCKET_LIST = {};

io.sockets.on('connection', function (socket) {
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket; 
    console.log(socket.id)

    socket.on('signIn', function (data) {
        isValidPassword(data, function (res) {
            if (res) {
                console.log("Sign in from " + data.username);
                Player.onConnect(socket, data.username);
                socket.emit('signInResponse', { success: true });
            } else {
                socket.emit('signInResponse', { success: false });
            }
        });
    });
    socket.on('signUp', function (data) {
        isUsernameTaken(data, function (res) {
            if (res) {
                socket.emit('signUpResponse', { success: false });
            } else {
                addUser(data, function () {
                    socket.emit('signUpResponse', { success: true });
                });
            }
        });
    });


    socket.on('disconnect', function () {
        delete SOCKET_LIST[socket.id];
    });

});

const accountSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    password: String
})

const messageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: { type: Date, default: Date.now },
    name: String,
    message: String,
    room: String
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

