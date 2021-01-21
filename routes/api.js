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

let cases=0;
let ccid;

const mycall = ()=>{
    console.log(`Cases : ${cases},   ${ccid}`)
}

router.get('/getCaseCount',(req,res)=>{
    casescount.find({  })
    .then((data)=>{
        res.json(data)
        const apna = data
        console.log(apna[0].casesTillDate)
        cases = apna[0].casesTillDate + 5
        ccid = apna[0]._id
        // console.log(`count ${data.casesTillDate}`)
        mycall()
    })
    .catch((err)=>{
        console.error(err);
    })
})



// router.put('/addcasecount',(req,res)=>{
//     casescount.findOneAndUpdate(ccid,{$set:{casesTillDate:cases+1}}, { returnOriginal : false }, (err,result)=>{
//         if(err)
//         {
//             console.log(err);
//         }
//         else{
//             res.status(200).json(result);
//         }
//     })
// })

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