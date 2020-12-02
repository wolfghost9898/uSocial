const { Router } = require('express')
const { addPublicacion, getPublicaciones, getTraduccionPublicacion, getPublicacionesEtiqueta }    = require('../controllers/publicacion.controller')
const router = Router()

router.post('/addPublicacion',addPublicacion)
router.get('/getPublicaciones',getPublicaciones)
router.get('/getPublicacionesEtiqueta/:etiqueta',getPublicacionesEtiqueta)
router.get('/getTraduccion/:texto',getTraduccionPublicacion)

module.exports = router