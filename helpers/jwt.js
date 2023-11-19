const jwt = require('jsonwebtoken');

const generateJWT = (uid, name) => new Promise((resolve, reject) => {
  const payload = { uid, name };

  jwt.sign(
    payload,
    process.env.SECRET_JWT_SEED,
    {
      expiresIn: '365d', // horas "5h"
    },
    (err, token) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        reject(new Error('No se pudo generar el token'));
      }

      resolve(token);
    },
  );
});

module.exports = {
  generateJWT,
};
