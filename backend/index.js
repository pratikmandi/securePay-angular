const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const env = require('dotenv')
const routes = require('./routes/routes')
env.config()


const app = express()

app.use(cors({
    credentials: true,
    origin: ['http://localhost:4200']
}))
app.use(cookieParser())
app.use(express.json())
app.use("/auth", routes)

mongoose.connect(process.env.MONGODB_URL).then(()=> {
    console.log('Connected to database.')
    app.listen(5000, ()=> {
        console.log('App running on PORT 5000')
    })
})