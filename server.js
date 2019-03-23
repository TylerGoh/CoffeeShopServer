var fs = require('fs');
const express = require('express')
const app = express()
var moment = require('moment-timezone');
var cors = require('cors')
var bodyParser = require('body-parser');
const port = 80

users = []

rooms = []

fs.exists('users.json', function(exists){
    if(exists){
        fs.readFile('users.json', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        users = JSON.parse(data); 
        }});
    }
    });

    fs.exists('rooms.json', function(exists){
        if(exists){
            fs.readFile('rooms.json', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
            rooms = JSON.parse(data);  
            }});
        } 
        });

app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/sendmessage',function(req,res){
    rooms.push({id:req.body.id,message:req.body.message,room:req.body.room,time:moment().tz("Singapore").format()})
    console.log(users)
    res.end("message received");
  });

app.post('/register',function(req,res){
    var trigger = false;
    for(key in users)
    {
        if(users[key].id == req.body.id)
        {
        res.end("id taken")
        trigger = true;
        }
    }
    if(trigger == false)
    {
    users.push({id:req.body.id,password:req.body.password,time:moment().tz("Singapore").format()})
    res.end("registration successfull")
    }
});

app.post('/requestmessage',function(req,res){
    let package = []
    for(i in users)
    {
        if(users[i].id==req.body.id)
        var time = users[i].time;
        var sender = i;
    }
    for(i in rooms)
    {
        if(rooms[i].room==req.body.room && rooms[i].time>time)
        package.push({id:rooms[i].id,messsage:rooms[i].message})
    }
    users[sender].time = moment().tz("Singapore").format(); 
    res.end(JSON.stringify(package));
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

setInterval(() => {
    let data = JSON.stringify(users);
    fs.writeFile('users.json',data,function(err,data){
        if(err) console.log('error',err);
    })
    data = JSON.stringify(rooms);
    fs.writeFile('rooms.json',data,function(err,data){
        if(err) console.log('error',err);
    })
}, 10000);