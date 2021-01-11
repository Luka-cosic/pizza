const express = require('express');
const routes = require('./routes');

const session = require('express-session');
const mongojs = require('mongojs');
const db = mongojs('pizza',['messages','users'])
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);




io.on('connection', (socket) => {
    socket.on("client message", function(msg){
            db.messages.find({ email : msg.email},(err,data)=>{
                let nep =  data[0].msg.filter(function(el){return el.read == "neprocitano"}).length;
                db.messages.update({email : msg.email},{$set:{nep : nep + 1}});
                 data[0].msg.push({ msg : msg.msg, from : "client", time : new Date().getHours()+"h : "+new Date().getMinutes()+"min", read : "neprocitano"});
                db.messages.update({email : msg.email},{$set: {msg : data[0].msg}},(err,data)=>{
                    db.messages.find({email : msg.email},(err,data)=>{
                        io.emit("neprocitane poruke",data[0]);
                    })  
                })    
            })   
            msg.time = new Date().getHours()+"h : "+new Date().getMinutes()+"min";
            io.emit('client message',msg );
        
    });

    socket.on("admin",function(msg){
        db.messages.find({ email : msg.email},(err,data)=>{
             data[0].msg.push({ msg : msg.msg, from : "admin", time : new Date().getHours()+"h : "+new Date().getMinutes()+"min"});
            db.messages.update({email : msg.email},{$set: {msg : data[0].msg}})    
        })   
    msg.time = new Date().getHours()+"h : "+new Date().getMinutes()+"min";  
    console.log(msg);
    
    io.emit('admin',msg);
        
    })

  });

const HALF_TIME = 1000 * 60 * 60 *12;
const {
        PORT = 3000,
        NODE_ENV = 'development',
        SESS_NAME = "sid",
        SESS_SECRET = 'pizza',
        SESS_LIFETIME = HALF_TIME
} = process.env;

const IN_PROD = NODE_ENV == 'production';

app.use(express.urlencoded({extended : false}))
app.use(express.json());
app.use(express.static(__dirname +'/public'));

app.set('view engine',"ejs");


app.use(session({
    name : SESS_NAME,
    resave : false,
    saveUnitialized : false,
    secret : SESS_SECRET,
    cookie : {
        maxAge : SESS_LIFETIME,
        sameSite : true,
        secure : IN_PROD
    }
}))

app.use('/', routes)



http.listen(3000,function(){
    console.log('Listening on port 3000');
    
})