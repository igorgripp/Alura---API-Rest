const res = require("express/lib/response");
const moment = require("moment");

const conexao = require("../infraestrutura/conexao");

class Atendimento {

  lista(res){
    const sql = 'SELECT * FROM Atendimentos';

    conexao.query(sql, (err, result) => {
      if(err){
        res.status(400).json(err);
      }else{
        res.status(200).json(result);
      }
    });
  }

  adiciona(atendimento, res) {
    const dataCriacao = moment().format("YYYY-MM-DD HH:MM:SS");
    const data = moment(atendimento.data, "DD/MM/YYYY").format(
      "YYYY-MM-DD HH:MM:SS"
    );

    const dataEhValida = moment(data).isSameOrAfter(dataCriacao);
    const clienteEhvalido = atendimento.cliente.length >= 5;

    const validacoes = [
      {
        nome: "data",
        valido: dataEhValida,
        mensagem: "Data deve se maior ou igual a data atual.",
      },
      {
        nome: "cliente",
        valido: clienteEhvalido,
        mensagem: "Nome deve se maior ou igual a 5 caracteres.",
      },
    ];

    const erros = validacoes.filter((campo) => !campo.valido);
    const existemErros = erros.length;

    if (existemErros) {
      res.status(400).json(erros);
    } else {
      const atendimentoDatado = { ...atendimento, dataCriacao, data };

      const sql = "INSERT INTO Atendimentos SET ?";

      conexao.query(sql, atendimentoDatado, (err, result) => {
        if (err) {
          res.status(400).json(err);
        } else {
          res.status(201).json(result);
        }
      });
    }
  }

  buscaPorId(id, res){

    const sql = `SELECT * FROM Atendimentos WHERE id = ${id}`;

    conexao.query(sql, (err, result) => {
      if (err) {
        res.status(400).json(err);
      } else {
        const atendimento = result[0];
        res.status(201).json(atendimento);
      }
    });

  }

  altera(id, valores, res){
    if(valores.data){
      valores.data = moment(valores.data, "DD/MM/YYYY").format(
        "YYYY-MM-DD HH:MM:SS"
      );
    }
    const sql = 'UPDATE Atendimentos SET ? WHERE id=?';

    conexao.query(sql, [valores, id], (err, result) => {
      if(err) {
        res.status(400).json(err);
      }else{
        res.status(200).json(result);
      }
    })
  }

  deletar(id, res){
    const sql = `DELETE FROM Atendimentos WHERE id=${id}`;
    conexao.query(sql, (err, result) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(201).json(result);
      }
    });
  }

}

module.exports = new Atendimento();
