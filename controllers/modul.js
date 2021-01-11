const express =  require('express');
const router = express.Router()
const mongojs = require('mongojs');

const db  = mongojs('pizza',['pice','dodaci'])


router.post('/',(req,res) => {
    let id = req.body.id;
    db.pice.find({ _id : mongojs.ObjectID(id)},(err,pica)=>{
        if(err) throw err;
        res.send(pica[0])
        
    })
    
})

module.exports = router;