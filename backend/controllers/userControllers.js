const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const registerUser = async (req,res) => {
    const {name, username, email, password} = req.body
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const record = await User.findOne({email: email})

    if(record) {
        return res.status(400).send("User already registered")
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

        return res.json(result)
    }
}

const loginUser = async (req,res) => {
    const {email, password} = req.body 

    const user = await User.findOne({email})
    console.log(user)

    if(!user) {
        return res.status(404).send("User not found!")
    }

    // console.log("entered password: ", password)
    // console.log("actual password: ", user.password)

    const isMatch = await bcrypt.compare(password, user.password)

    // console.log(isMatch)

    if(!isMatch) {
        return res.status(400).send("Invalid credentials")
    }

    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 24*60*60*1000
    })

    // return res.json({
    //     message: "Login Successful",
    //     // user: {
    //     //     id: user._id,
    //     //     name: user.name,
    //     //     email: user.email
    //     // }
    // })


}

const getUser = async (req,res) => {
    const user = await User.findOne({_id: req._id})
    const {password, ...data} = await user.toJSON()
    return res.send(data)
}

module.exports = {registerUser, loginUser, getUser}