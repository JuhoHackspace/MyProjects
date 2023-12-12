const db = require('../database');

const user = {
  getAll: function(callback) {
      return db.query('select * from user', callback);
  },
  getById: function(id, callback) {
      return db.query('select * from user where id_user=?', [id], callback);
  },
  add: function (user, callback) {
      return db.query(
      'insert into user (firstname, lastname, address, city) values(?,?,?,?)',
      [user.firstname, user.lastname, user.address, user.city],
      callback);
  },
  delete: function(id, callback) {
      return db.query('delete from user where id_user=?', [id], callback);
  },
  update: function(id, user, callback) {
      return db.query('update user set firstname=?,lastname=?, address=?, city=? where id_user=?',
      [user.firstname, user.lastname, user.address, user.city, id], callback);
  }
};
module.exports = user;