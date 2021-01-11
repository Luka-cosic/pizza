const express = require("express");
const router = express.Router();


router.use('/',require('./home'));

router.use("/admin",require('./admin'))

router.use('/modul',require('../controllers/modul'));






module.exports = router