const express = require('express')
const UserData = require('../models/User')
const CaseData = require('../models/Case')
const casescount = require('../models/CasesCount')
const router = express.Router();

router.get('/',(req,res)=>{
    res.send('Hey there!!!');
})

router.post('/createUser',(req,res)=>{
    const userData = req.body;
    const newUser = new UserData(userData)
    newUser.save((err)=>{
        if(err)
        {
            console.log(err)
            res.status(404).json({
                msg:'Internal Server Error'
            })
            return;
        }
        else
        {
            res.json({
                msg : "User created successfully!"
            });
        }
    })
})



router.post('/submitCase',(req,res)=>{
    const caseData = req.body;
    const newCase = new CaseData(caseData)
    newCase.save((err)=>{
        if(err)
        {
            console.log(err)
            res.status(404).json({
                msg:'Internal Server Error'
            })
            return;
        }
        else
        {
            res.json({
                msg : "Case submitted successfully!"
            });
        }
    })
})

//Incomplete
router.get('/getDashboard/:id',(req,res)=>{
    const userId = req.params.id;

    UserData.find({"firebaseId":`${userId}`})
    .then((data)=>{
        console.log(data);
        res.json(data)
    })
    .catch((err)=>{
        console.log(err)
    })
})

module.exports = router