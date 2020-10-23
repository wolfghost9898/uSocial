const { Router } = require('express')
const { solicitud }    = require('../controllers/amigos.controller')
const router = Router()

router.post('/enviar',solicitud)



module.exports = router