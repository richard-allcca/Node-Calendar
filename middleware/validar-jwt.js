const { response } = require('express');
const jwt = require('jsonwebtoken');

// eslint-disable-next-line default-param-last
const validarJwt = (req, res = response, next) => {
  const token = req.header('x-token');
  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'No hay token',
    });
  }

  try {
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const { uid, name } = payload; // payload trae la fecha de expiración

    req.uid = uid;
    req.name = name;

    return next();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return res.status(401).json({
      ok: false,
      msg: 'Token no valido',
    });
  }
};

module.exports = {
  validarJwt,
};
