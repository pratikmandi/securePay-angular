const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const env = require('dotenv')
const routes = require('./routes/routes')
env.config()


const app = express()
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:4200',
  'https://securepay-angular-1.onrender.com'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(cookieParser())
app.use(express.json())
app.use("/auth", routes)

mongoose.connect(process.env.MONGODB_URL).then(()=> {
    console.log('Connected to database.')
    app.listen(PORT, ()=> {
        console.log(`App running on PORT ${PORT}`)
    })
})
