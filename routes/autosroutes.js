const express = require('express');
const router = express.Router();

const autoController = require('../controller/autoscontroller');

// Obtener TODOS los autos
router.get('/todos', autoController.obtenerTodosLosAutos);

// Ruta para obtener autos disponibles
router.get('/', autoController.autosDisponibles);

// Ruta para registrar un nuevo auto
router.post('/', autoController.registrarAuto);

module.exports = router;
