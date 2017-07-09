var Sequelize = require('sequelize');
var path = require('path');

var sequelize = new Sequelize(undefined,undefined, undefined, {
  host: 'localhost',
  dialect: 'sqlite',

  storage: path.join(__dirname, '../database/database.sqlite') 
});

/*
sequelize
    .authenticate()
    .then(function (err) {
        console.log('Connection has been established successfully');
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });
*/    

var Note = sequelize.define('note', {
  text: {
    type: Sequelize.STRING
  },
  uid: {
    type: Sequelize.STRING
  }
});

Note.sync()

module.exports = Note;