const { Router } = require('express');
const { check } = require('express-validator');
const { login, register, updateToken } = require('../controllers/auth.controller');
const { validateFields } = require('../middleware/validateFields');
const { validarJwt } = require('../middleware/validar-jwt');

const router = Router();

/*
  Rutas de Usuarios / Auth
  host + /api/auth
 */

// Login
router.post(
  '/',
  [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validateFields,
  ],
  login,
);

// Register
router.post(
  '/register',
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('password', 'El debe tener minimo 6 caracteres').isLength({ min: 6 }),
    validateFields,
  ],
  register,
);

// Validate and update token
router.get('/renew', validarJwt, updateToken);

module.exports = router;
