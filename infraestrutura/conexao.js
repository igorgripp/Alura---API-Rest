const mysqli = require('mysql');

const conexao = mysqli.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'mysql9J!!xifd',
  database: 'agenda-petshop'
});

module.exports = conexao;