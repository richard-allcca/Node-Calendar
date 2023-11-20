const { response, request } = require('express');
const Evento = require('../models/Evento');

module.exports.getEvents = async (req, res = response) => {
  const eventos = await Evento.find().populate('user', 'name');

  res.status(200).json({
    ok: true,
    eventos,
  });
};

module.exports.createEvent = async (req = request, res = response) => {
  const event = new Evento(req.body);

  try {
    event.user = req.uid;

    const eventSaved = await event.save();

    res.status(200).json({
      ok: true,
      msg: 'create event',
      evento: eventSaved,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Contacte con sel administrador',
    });
  }
};

module.exports.updateEvent = async (req = request, res = response) => {
  const { id: eventoId } = req.params;
  // eslint-disable-next-line prefer-destructuring
  const uid = req.uid;

  try {
    const eventDb = await Evento.findById(eventoId);
    if (!eventDb) {
      return res.status(404).json({
        ok: false,
        msg: 'El evento no existe',
      });
    }

    if (eventDb.user.toString() !== uid) {
      // console.log('entro',eventDb.user.toString(), req.uid);
      return res.status(401).json({
        ok: false,
        msg: 'No tiene privilegio para editar este evento',
      });
    }

    const nuevoEvento = {
      ...req.body,
      user: uid,
    };
    const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });

    return res.status(200).json({
      ok: true,
      evento: eventoActualizado,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

module.exports.deleteEvent = async (req, res = response) => {
  const { id: eventoId } = req.params;

  // eslint-disable-next-line prefer-destructuring
  const uid = req.uid;

  try {
    const eventDb = await Evento.findById(eventoId);
    if (!eventDb) {
      return res.status(404).json({
        ok: false,
        msg: 'El evento no existe',
      });
    }

    if (eventDb.user.toString() !== uid) {
      // console.log('entro',eventDb.user.toString(), req.uid);
      return res.status(401).json({
        ok: false,
        msg: 'No tiene privilegio para eliminar este evento',
      });
    }

    // const eventoActualizado = await Evento.deleteOne({ _id: eventoId });
    const eventoActualizado = await Evento.findByIdAndDelete({ _id: eventoId });

    return res.status(200).json({
      ok: true,
      evento: eventoActualizado,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};
