const { Router } = require('express')
const { login, register, updateUsuario }    = require('../controllers/auth.controller')
const router = Router()

router.post('/login',login)
router.post('/register',register)
router.put('/updateUsuario/:usuarioActual',updateUsuario)


module.exports = router