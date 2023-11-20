const moment = require('moment/moment');

module.exports.isDate = (value, { req, location, path }) => {
  if (!value) return false;

  const fecha = moment(value);
  if (fecha.isValid()) {
    return true;
  }
};
