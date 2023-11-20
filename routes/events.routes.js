const { Router } = require('express');
const { check } = require('express-validator');
const { validarJwt } = require('../middleware/validar-jwt');
const {
  getEvents, createEvent, updateEvent, deleteEvent,
} = require('../controllers/events.controller');
const { validateFields } = require('../middleware/validateFields');
const { isDate } = require('../helpers/isDate');

const router = Router();

// Uso de middleware para todas las rutas
router.use(validarJwt);

// Obtener eventos
router.get('/', getEvents);

// Create event
router.post(
  '/',
  [
    check('title', 'Titlte es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom(isDate),
    check('end', 'Fecha de termino es obligatoria').custom(isDate),
    validateFields,
  ],
  createEvent,
);

// Update event
router.put('/:id', updateEvent);

// Delete event
router.delete('/:id', deleteEvent);

module.exports = router;
