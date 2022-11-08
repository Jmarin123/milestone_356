const express = require('express')
const router = express.Router()
const UserController = require('../controllers/user-controller')
//routes for all of the user functions
router.post('/signup', UserController.registerUser)
router.post('/login', UserController.loginUser)
router.get('/logout', UserController.logoutUser)
router.post('/verify', UserController.verifyUser)

module.exports = router