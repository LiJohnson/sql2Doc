const readFromStdin = require('./readFromStdin').readFromStdin
const mysql = require('./mysql2json').toJson
const postgresql = require('./postgresql2json').toJson

const MAP = {mysql,postgresql}

const toJson = MAP[process.env.SQL_TYPE] || mysql

// console.log(process.env)

exports.readFromStdin = ()=>readFromStdin().then(toJson)