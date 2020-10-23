const { Router } = require('express')
const { solicitud, getSolicitudes }    = require('../controllers/amigos.controller')
const router = Router()

router.post('/enviar',solicitud)
router.get('/getSolicitudes/:usuario',getSolicitudes)



module.exports = router