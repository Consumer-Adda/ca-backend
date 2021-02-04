/***
 * 
 * Code by Ankit Pandey
 * Contact - ankitpandeycu@gmail.com
 * 
 */

const express = require('express')
const UserData = require('../models/User')
const CaseData = require('../models/Case')
const casescount = require('../models/CasesCount')
var admin = require('firebase-admin')
const router = express.Router();

var serviceAccount = require("../consumeradda-a5a94-firebase-adminsdk-gvx8r-b0789596e4.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://consumeradda-a5a94.firebaseio.com"
});


router.get('/',(req,res)=>{
    res.send('Consumer-Adda Backend!   API docs to be added soon');
})

/***
 * 
 * User APIs
 * 
 * POST - /createUser
 * 
 */

function auth(req,res,next){
    const idToken = req.params.token
    admin.auth().verifyIdToken(idToken)
    .then((decodedToken)=>{
        next()
    })
    .catch((err)=>{
        res.status(401).json({
            msg:'Session Expired. Please restart the app!'
        })
    })
}

 

/*** (Common) User Creation API*/
router.post('/createUser',(req,res)=>{
    const userData = req.body;
    const newUser = new UserData(userData)
    newUser.save((err)=>{
        if(err)
        {
            console.log(err)
            res.status(500).json({
                msg:'Internal Server Error'
            })
            return;
        }
        else
        {
            res.status(201).json({
                msg : "User created successfully!"
            });
        }
    })
})

/*** (ADMIN App) Getting VERIFIED lawyers */
router.get('/getlawyers',(req,res)=>{
    UserData.find({ $and:[{isLawyer:true,isVerified:true}] })
    .then((data)=>{
        res.status(200).json(data);
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({
            msg:'Internal Server Error'
        })
    })
})

/*** (ADMIN App) Getting NOT VERIFIED lawyers */
router.get('/getNotVerified',(req,res)=>{
    UserData.find({ $and:[{isLawyer:true,isVerified:false}] })
    .then((data)=>{
        res.status(200).json(data);
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({
            msg:'Internal Server Error'
        })
    })
})

/*** (ADMIN App) Verify lawyer */
router.patch('/verify/:id',(req,res)=>{
    const fireId = req.params.id
    UserData.findOneAndUpdate({firebaseId:fireId},{$set:{isVerified:true}})
    .then((data)=>{
        console.log(data);
        res.status(202).json({
            msg:'Lawyer Verification Complete'
        })
    })
    .catch((err)=>{
        console.log(err)
        res.status(400).json({
            msg:'Error Occured while verifying the lawyer'
        })
    })
})

/*** (ADMIN App) Remove Lawyer  -  (In initial release Removing lawyer means Unverifying them) */
router.patch('/unverify/:id',(req,res)=>{
    const fireId = req.params.id
    UserData.findOneAndUpdate({firebaseId:fireId},{$set:{isVerified:false}})
    .then((data)=>{
        console.log(data);
        res.status(202).json({
            msg:'Lawyer Removal Complete'
        })
    })
    .catch((err)=>{
        console.log(err)
        res.status(400).json({
            msg:'Error Occured while removing the lawyer'
        })
    })
})

/*** (ADMIN App) See Case Details */
router.get('/details/:id',(req,res)=>{
    const cid = req.params.id;
    CaseData.find({ caseId:cid })
    .then((data)=>{
        res.status(200).json(data)
    })
    .catch((err)=>{
        res.status(500).json({
            msg:'Error while fetching case details!'
        })
    })
})

/*** 
 * 
 * Case APIs
 * 
 * POST - /submitCase/token
 * PATCH - /addcase/token
 * PATCH - /updateStatus/caseId/NewStatus/token
 * 
 */

/*** Case Submission API - Token Required  */
router.post('/submitCase/:token',auth,(req,res)=>{
    const caseData = req.body;
    const newCase = new CaseData(caseData)
    newCase.save((err)=>{
        if(err)
        {
            console.log(err)
            res.status(500).json({
                msg:'Internal Server Error'
            })
        }
        else
        {
            res.status(200).json({
                msg : "Case submitted successfully!"
            });
        }
    })
})

/*** Adding Case to DB-log - Token Required  */
router.patch('/addcase/:token',auth,(req,res)=>{
    casescount.findByIdAndUpdate(process.env.ccid,{$inc:{casesTillDate:1}},{new:true},(err,result)=>{
        if(err)
        {
            console.log(err);
            res.status(404).json({
                msg:'Internal Server Error'
            })
        }
        else
        {
            res.status(200).json(result)
        }
    })
})

/*** Updating case status - Token Required  */
router.patch('/updateStatus/:id/:status/:token',auth,(req,res)=>{
    const cid = req.params.id;
    const newStatus = req.params.status
    var today = new Date();
    
    // console.log(today)
    CaseData.findOneAndUpdate({caseId:cid},{$set:{caseStatus:newStatus, lastActionDate:today }})
    .then((data)=>{
        // console.log(data);
        res.status(200).json({
            msg:'Case Status Updated!'
        })
    })
    .catch((err)=>{
        console.log(err)
        res.status(500).json({
            msg:'An error occured while updating case status'
        })
    })
})

/***
 * 
 * Dashboard APIs 
 * GET - /userData/:id/:token
 * GET - /getCases/:id/:token
 * 
 * */
/*** Getting User Data for Dashboard */
router.get('/userData/:id/:token',auth,(req,res)=>{
    const fireId = req.params.id;

    UserData.find({ firebaseId:fireId })
    .then((data)=>{
        res.status(200).json(data);
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).json({
            msg:'Error while fetching data'
        })
    })
})

/*** Getting User Cases for Dashboard - Token Required  */
router.get('/getCases/:id/:token',auth,(req,res)=>{
    const fireId = req.params.id;

    CaseData.find({ $and:[{$or:[{applicantFirebaseId:fireId},{lawyerFirebaseId:fireId}]},{caseStatus:{$lte:3}}] })
    .then((data)=>{
        res.status(200).json(data);
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).json({
            msg:'Error Occured!'
        })
    })
})


/*** 
 * 
 * Lawyer's APIs
 * GET - /seeCasesSD/:states/:district
 * GET - /seeCasesS/:states
 * PATCH - /accept/:id/:token
 * 
 */

 /*** Getting all open cases whose State and District are given - Token Required  */
 router.get('/seeCasesSD/:states/:district/:token',auth,(req,res)=>{
     const notassigned = 'N/A'
     const lawyerState = req.params.states
     const lawyerDistrict = req.params.district
     CaseData.find({ $and: [{lawyerFirebaseId: notassigned},{stateNumber:lawyerState},{districtNumber:lawyerDistrict}] })
     .then((data)=>{
        res.status(200).json(data)
     })
     .catch((err)=>{
         console.log(err);
         res.status(500).json({
             msg:'An error occured while fetching cases'
         })
     })
 })

 /*** Getting all open cases whose State are given - Token Required */
 router.get('/seeCasesS/:states/:token',auth,(req,res)=>{
    const notassigned = 'N/A'
    const lawyerState = req.params.states
    CaseData.find({ $and: [{lawyerFirebaseId: notassigned},{stateNumber:lawyerState}] })
    .then((data)=>{
       res.status(200).json(data)
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({
            msg:'An error occured while fetching cases'
        })
    })
 })

 /*** Accepting open case - Token Required */
 router.patch('/accept/:id/:token',auth,(req,res)=>{
    var rbody = req.body
    const cid = req.params.id
    const lawyerFireId = rbody.lawyerFirebaseId
    const lawyername = rbody.lawyerName
    const lawyeremail = rbody.lawyerEmail
     var today = new Date()

     CaseData.findOneAndUpdate({caseId:cid},{$set:{lawyerFirebaseId:lawyerFireId, lawyerName:lawyername, lawyerEmail:lawyeremail,lastActionDate:today}} )
     .then(()=>{
         res.status(200).json({
             msg:'Case Accepted Successfully'
         })
     })
     .catch((err)=>{
         console.log(err)
         res.status(500).json({
             msg:'An error occured while accepting the case'
         })
     })
 })


module.exports = router
