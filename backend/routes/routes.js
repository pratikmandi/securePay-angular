const {Router} = require('express')
const { default: mongoose } = require('mongoose')
const { registerUser, loginUser, getUser } = require('../controllers/userControllers')

const router = Router()

router.post('/register', registerUser)

router.post('/login', loginUser)

router.get('/user', getUser)

module.exports = router