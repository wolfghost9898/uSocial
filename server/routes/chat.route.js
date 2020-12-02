const { Router } = require('express')
const { enviar, getConversion }    = require('../controllers/chat.controller')
const router = Router()

router.post('/enviar',enviar)
router.get('/conversacion/:usuario1/:usuario2',getConversion)


module.exports = router