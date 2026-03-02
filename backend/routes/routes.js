const {Router} = require('express')
const { default: mongoose } = require('mongoose')
const { registerUser, loginUser, getUser } = require('../controllers/userControllers')
const { validateToken } = require('../middlewares/validation')
const { addCard } = require('../controllers/cardInfoControllers')

const router = Router()

router.post('/register', registerUser)

router.post('/login', loginUser)

router.get('/user', validateToken, getUser)

router.post('/cards', addCard)

module.exports = router