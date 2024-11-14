import mysql from "mysql2/promise"
import { config } from "dotenv";

 
config()
 
export default function conexao(){
    const pool = mysql.createPool({
        host: process.env.HOST_DATABASE, 
        port:  process.env.PORT,
        user: process.env.USER, 
        password: process.env.PASSWORD, 
        database: process.env.DATA_BASE
    })
 
    return pool
}

export async function incluirDados(item, tabela) {    
  console.log("Foi adicionado: " + item);

  const query = `INSERT INTO ${tabela} (nome, descricao, tipo) VALUES (?, ?, ?)`;
  
  console.log(query);
  const con = conexao()
  try {
      const [results] = await con.query(query, [item.nome, item.descricao, item.tipo]);
      console.log('Dados consultados', results.affectedRows);
      return results;
  } catch (err) {
      console.error(err);
      return { error: err.message }; // Return error message in a structured way
  }
}