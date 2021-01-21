const mongoose = require('mongoose')

const CaseSchema = new mongoose.Schema({
    caseId:{
        type: Number, 
        required:true,
        set: function (v) { return Math.round(v) ;}
    },
    applicantFirebaseId:{
        type:String,
        required:true
    },
    applicantEmail:{
        type:String,
        required:true
    },
    applicantFirstName:{
        type:String,
        required:true
    },
    applicantLastName:{
        type:String,
        required:true
    },
    applicantState:{
        type:String,
        required:true
    },
    applicantDistrict:{
        type:String,
        required:true
    },
    caseAgainst:{
        type:String,
        required:true
    },
    caseType:{
        type:String,
        required:true
    },
    caseDescription:{
        type:String,
        required:true
    },
    caseMoney:{
        type:String,
        required:true
    },
    attachment1:{
        type:String,
    },
    attachment2:{
        type:String,
    },
    attachment3:{
        type:String,
    },
    attachment4:{
        type:String,
    },
    attachment5:{
        type:String,
    },
    applicantPhone:{
        type:String,
    },
    lawyerFirebaseId:{
        type:String,
        required:true,
        default:'N/A'
    },
    lawyerName:{
        type:String,
        required:true,
        default:'N/A'
    },
    caseStatus:{
        type: Number, 
        required:true,
        set: function (v) { return Math.round(v) ;}
    },
    lastActionDate:{
        type:Date,
        default:Date.now
    }
})

const CaseData = mongoose.model('cases',CaseSchema);
module.exports = CaseData

/**
 * 
 * Sample Data
 * 
 caseId:1,
 applicantFirebaseId:'testapplicantid',
 applicantEmail:'testapplicantemail@example.com',
 applicantFirstName:'testapplicantFirstName',
 applicantLastName:'testapplicantLastName',
 applicantState:'testapplicantState',
 applicantDistrict:'testapplicantDistrict',
 caseAgainst:'testcaseAgainst',
 caseType:'testCaseType',
 caseDescription:'testcaseDescription',
 caseMoney:'testcaseMoney',
 attachment1:'',
 attachment2:'',
 attachment3:'',
 attachment4:'',
 attachment5:'',
 applicantPhone:'9876543210',
 lawyerFirebaseId:'testlawyerFirebaseId',
 lawyerName:'testLaywerName',
 caseStatus:0
 */