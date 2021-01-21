const express = require('express')
const connectDB = require('./db')
const dotenv = require('dotenv');
dotenv.config({ path:'./config/config.env' })
const PORT = process.env.PORT || 5000

const app = express();

connectDB()

app.use(express.json());//to render json data received from req call
app.use(express.urlencoded({ extended: false })); // to render urls 

app.use('/',require('./routes/api'))

app.listen(PORT,console.log(`Consumer Adda server is on ${PORT}`))