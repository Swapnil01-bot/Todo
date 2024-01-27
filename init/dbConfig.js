let { Sequelize, Model, DataTypes, Op } = require("sequelize")
let config = require("config")
let mysql = config.get('mysql');
let sequelizeCon = new Sequelize(mysql);
sequelizeCon.authenticate().then(() => { console.log("database connected"); }).catch((error) => { console.log("databse error", error); })

module.exports = { sequelizeCon, Model, DataTypes, Op };