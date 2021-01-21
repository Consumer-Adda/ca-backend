const mongoose = require('mongoose')

const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify:false
        })

        console.log(`MongoDB connected with host ${conn.connection.host}`);
    }
    catch(err)
    {
        console.error(err);
        process.exit(1);
    }
}

module.exports = connectDB