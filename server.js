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

app.post('/login',function(req,res){
    let temp = "wrong username"
    let body = req.body
    for (i in users)
    {
        if (users[i].id == body.id)
        {
            if(users[i].password==body.password)
            temp = "success"
            else
            temp = "wrong password"
        }
    }
    res.end(temp)
    
})

app.post('/sendmessage',function(req,res){
    let body = req.body;
    rooms.push({id:body.id,
                message:body.message,
                room:body.room,
                time:moment().tz("Singapore").format()})
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
    var time;
    for(i in users)
    {
        if(users[i].id==req.body.id)
        {
        time = users[i].time;
        users[i].time = moment().tz("Singapore").format(); 
        }
    }
    for(g in rooms)
    {
        if(rooms[g].room==req.body.room && moment(rooms[g].time).isAfter(time))
        package.push({id:rooms[g].id,message:rooms[g].message})
    }
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