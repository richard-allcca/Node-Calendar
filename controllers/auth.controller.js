const { request, response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generateJWT } = require('../helpers/jwt');

module.exports.login = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    // console.log(user);
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'El email o password incorrectos',
      });
    }

    // Confirm pass
    const validPass = bcrypt.compareSync(password, usuario.password);
    if (!validPass) {
      return res.status(400).json({
        ok: false,
        msg: 'Validation Pass fail',
      });
    }

    // Generate JWT
    const token = await generateJWT(usuario.id, usuario.name);

    return res.status(200).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: 'Algo salio mal',
    });
  }
};

module.exports.register = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario con ese email ya existe',
      });
    }

    usuario = new Usuario(req.body);

    // Encrypt pass
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    // Save user
    await usuario.save();

    // Generate JWT
    const token = await generateJWT(usuario.id, usuario.name);

    const resultRegister = {
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    };

    return res.status(201).json(resultRegister);
  } catch (error) {
    return res.status(500).json({ ok: false, msg: 'Hable con el servidor' });
  }
};

module.exports.updateToken = async (req = request, res = response) => {
  const { uid, name } = req;

  // Generate JWT
  const token = await generateJWT(uid, name);

  res.json({
    ok: true,
    uid,
    name,
    token,
  });
};
