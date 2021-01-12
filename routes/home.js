const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');
var events = require('events');

const db = mongojs('pizza',['pice','dodaci','users','naruceno','messages'])


var eventEmitter = new events.EventEmitter();

// Pocetna stranica

router.get('/', (req, res)=>{
let logUser = req.session.user;
    db.pice.find({},(err,pice)=>{
     db.dodaci.find({},(err,dodaci)=>{
         
        if(err) throw err
        res.render('index',{
            pice : pice,
            dodaci : dodaci,
            logUser : logUser
        })
     })
           
    })   
})

// Chat icon

router.post('/chatIcon',(req, res)=>{
    let email = req.body.email;
    db.messages.find({ email : email },(err,data)=>{
        res.send(data[0])
        
    })
    
})

// Registracija pogled

router.get("/registerView",(req, res)=>{
    if(req.session.user){
        res.redirect('/')
    }else{

        res.render('register');
    }
    
})

// Registrovanje

router.post('/register',(req, res)=>{
    db.users.find({email : req.body.email},(err,data)=>{
        if(data.length == 1){
            res.redirect("/registerView")
        }else{
            db.users.insert([{name:req.body.name, email:req.body.email, pass:req.body.pass, role : "user"}],(err,data)=>{
                db.messages.insert([{ name : req.body.name, email : data[0].email, nep : "", msg : []}],(err,data)=>{
                    if(err) throw err;
                    res.redirect('/loginView')
                })
                
            })
        }
        
    })
    
    
})

// Logovanje pogled

router.get("/loginView",(req, res)=>{
    if(req.session.user){
        res.redirect('/')
    }else{
        res.render('login')
    }
   
})


// home admin

router.post("/login",(req, res)=>{
    db.users.find({ name : req.body.your_name, pass : req.body.your_pass},(err,data)=>{
        if(err) throw err;
        
        if(data.length == 1){
            req.session.user = data[0];
            if(data[0].role == 'admin'){
               res.redirect('/admin')  
            }else{
                res.redirect('/')
            }
            
        }else{
            res.redirect('/registerView')
        }   
    })   
})

// Logout

router.get('/logout',(req, res)=>{
    req.session.destroy(function(err) {
        res.redirect('/')
      })
})

// Narucivanje 



router.post('/naruciti',(req, res)=>{
    if(req.body.adresa == ""){
        res.redirect('/')
    }else{
        db.naruceno.insert([
            {
            name : req.session.user.name,
            email : req.session.user.email,
            time : req.body.vreme,
            narudzbina : req.body
        }
        ],(err,data)=>{
            res.redirect('/')
        })
    }
    
    
    
})


module.exports = router

