const { Router } = require('express')
const { addPublicacion, getPublicaciones }    = require('../controllers/publicacion.controller')
const router = Router()

router.post('/addPublicacion',addPublicacion)
router.get('/getPublicaciones',getPublicaciones)

module.exports = router