const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const registerUser = async (req,res) => {
    let {name, username, email, password} = req.body
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const record = await User.findOne({email: email})

    if(record) {
        res.status(400).send("User already registered")
    } else {
        const user = new User({
            name: name,
            username: username,
            email: email,
            password: hashedPassword
        })

        const result = await user.save()

        const {_id} = await result.toJSON()

        const token = jwt.sign({_id: _id}, process.env.JWT_SECRET)
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 24*60*60*1000
        })

        res.json(result)
    }
}

const loginUser = async (req,res) => {
    res.send("Login Successful.")
}

const getUser = async (req,res) => {
    res.send("User!")
}

module.exports = {registerUser, loginUser, getUser}