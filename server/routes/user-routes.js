const express = require('express')
const router = express.Router()
const UserController = require('../controller/user-controller')


//routes for all of the user functions
router.post('/users/signup', UserController.registerUser) 
router.post('/users/login', UserController.loginUser)
router.get('/users/logout', UserController.logoutUser)
router.get('/users/verify', UserController.verifyUser) 

module.exports = router