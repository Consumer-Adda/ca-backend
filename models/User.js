const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firebaseId:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        default:""
    },
    isLawyer:{
        type:Boolean,
        required:true
    },
    isVerified:{
        type:Boolean,
        required:true
    }
});

const UserData = mongoose.model('Users',UserSchema)

const sampleData = {
    firebaseId:'testFirebaseId',
    name:'testUserName',
    email:'testUser@example.com',
    phoneNumber:'XXXXXXX',
    isLawyer:false,
    isVerfied:true
}


module.exports = UserData;

/**
 * 
 * Sample Data
 * 
 
 firebaseId:'testFirebaseId',
 name:'testUserName',
 email:'testUser@example.com',
 phoneNumber:'XXXXXXX',
 isLawyer:false,
 isVerified:true

 */