const { Router } = require('express')
const { login, register }    = require('../controllers/auth.controller')
const router = Router()

router.get('/login',login)
router.post('/register',register)



module.exports = router