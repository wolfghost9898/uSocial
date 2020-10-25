const { Router } = require('express')
const { solicitud, getSolicitudes, addAmigo, rechazar, getAmigos }    = require('../controllers/amigos.controller')
const router = Router()

router.post('/enviar',solicitud)
router.get('/getSolicitudes/:usuario',getSolicitudes)
router.post('/add',addAmigo)
router.post('/rechazar',rechazar)
router.get('/getAmigos/:usuario',getAmigos)


module.exports = router