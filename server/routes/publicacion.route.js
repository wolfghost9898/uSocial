const { Router } = require('express')
const { addPublicacion, getPublicaciones, getTraduccionPublicacion }    = require('../controllers/publicacion.controller')
const router = Router()

router.post('/addPublicacion',addPublicacion)
router.get('/getPublicaciones',getPublicaciones)
router.get('/getTraduccion/:texto',getTraduccionPublicacion)

module.exports = router