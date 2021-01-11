const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');
var events = require('events');
const db = mongojs('pizza',['naruceno','messages',"users"]);




router.use(obezbedi)

function obezbedi(req, res, next) {
    if(req.session.user){
        if(req.session.user.role === 'admin') {
            next()  
        }else{
            res.redirect('/')
        }
    }else{
        res.redirect('/')
    }
    
}

router.get('/',(req, res)=>{
    db.naruceno.find({},(err,sveNarudzbine)=>{
        db.messages.find({},(err,allChatUsers)=>{
            res.render('admin/index',{sveNarudzbine : sveNarudzbine, user : req.session.user, allChatUsers : allChatUsers });
        })
        
    })
})

router.post('/izaberi',(req, res)=>{
    let id = req.body.id
    db.messages.find({ _id : mongojs.ObjectID(id)},(err,data)=>{
        let newArr = [];
        data[0].msg.map(function(el){
            el.read = "procitano";
            newArr.push(el)
        });
        db.messages.update({_id : mongojs.ObjectID(id)},{$set:{nep : "", msg : newArr}});
        
        res.send(data[0])
        
    })  
})

router.post('/modal',(req,res)=>{
    db.naruceno.find({ _id : mongojs.ObjectID(req.body.id)},(err,data)=>{
        res.send(data)
    })
    
})

router.get('/registracija',(req,res)=>{
    res.render('admin/registracija')
})

router.post('/registruj',(req,res)=>{
    
    db.users.find({email : req.body.mail},(err,data)=>{
        if(data.length == 1){
            res.redirect("/admin/registracija");
        }else{
            db.users.insert({ name: req.body.ime, lastName: req.body.prezime, email: req.body.mail,
                    pass : req.body.pass, broj : req.body.broj, role: req.body.role},(err,data) => {
                        db.messages.insert([{ name : req.body.ime, email : req.body.mail, nep : "", msg : []}],(err,data)=>{
                            if(err) throw err;
                            res.redirect('/admin')
                            });
                    });
    
    }
})     
})


router.get('/dostavljaci',(req, res)=>{
    db.users.find({role : "dostavljac"},(err,dostavljaci) => { 
    res.render('admin/dostavljaci',{user : req.session.user, dostavljaci : dostavljaci})

    })
})

router.post('/delete',(req, res)=>{
    let id = req.body.id
    db.naruceno.remove({ _id : mongojs.ObjectID(id)},(err,data)=>{
        res.send("ok")
    })
    
})

router.get('/logout',(req, res)=>{
    req.session.destroy(function(err) {
        res.redirect('/')
      })
})




module.exports = router