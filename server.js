const express = require('express')
const app = express()
var moment = require('moment-timezone');
var cors = require('cors')
const port = 80



var d = moment().tz("Singapore").format();
console.log(d)  

app.use(cors())

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/sendmessage',function(req,res){
    var id=req.body.id;
    var message=req.body.message;
    var room=req.body.room;
    console.log(id,message,room);
    var json = JSON.stringify({
        id:id,
        message:room,
        room:room
    })
    res.end(json);
  });



app.listen(port, () => console.log(`Example app listening on port ${port}!`))