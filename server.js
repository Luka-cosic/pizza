const express = require('express');
const routes = require('./routes')


const app = express()

app.use(express.urlencoded({extended : false}))
app.use(express.json());
app.use(express.static(__dirname +'/public'));

app.set('view engine',"ejs");
app.use('/', routes)

// app.get('/',(req,res) => {
//     res.render("index.ejs")
// })






app.listen(3000,function(){
    console.log('Listening on port 3000');
    
})