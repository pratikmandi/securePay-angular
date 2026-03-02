const jwt = require('jsonwebtoken')

 const validateToken = async (req, res, next) => {
    const token = req.cookies.jwt

    if(!token) {
        res.status(401).send("Unauthorized")
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).send("Invalid token")
    }
 }

 module.exports = {validateToken}