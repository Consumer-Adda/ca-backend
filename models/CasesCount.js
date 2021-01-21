const mongoose = require('mongoose');

const casesCountSchema = new mongoose.Schema({
    casesTillDate:{
        type: Number, 
        required:true,
        set: function (v) { return Math.round(v) ;}
    }
});

const caseCount = mongoose.model('casescount',casesCountSchema);

module.exports = caseCount