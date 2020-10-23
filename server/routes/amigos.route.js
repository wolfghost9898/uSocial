const { Router } = require('express')
const { solicitud, getSolicitudes, addAmigo, rechazar }    = require('../controllers/amigos.controller')
const router = Router()

router.post('/enviar',solicitud)
router.get('/getSolicitudes/:usuario',getSolicitudes)
router.post('/add',addAmigo)
router.post('/rechazar',rechazar)


module.exports = router