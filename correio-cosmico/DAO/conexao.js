import mysql from "mysql2/promise"
import { config } from "dotenv"

 
config()
 
export function conexao(){
    const pool = mysql.createPool({
        host: process.env.HOST_DATABASE, 
        port:  process.env.PORT,
        user: process.env.USER, 
        password: process.env.PASSWORD, 
        database: process.env.DATA_BASE
    })
 
    return pool
}

export async function incluirDados(tabela, dados = [], colunas = []) {
    console.log("Adicionando os seguintes dados:", dados)

    // Gera dinamicamente a query com base nas colunas fornecidas
    const query = `INSERT INTO ${tabela} (${colunas.join(", ")}) VALUES (${colunas.map(() => "?").join(", ")})`
    console.log("Query gerada:", query)

    const con = conexao()

    try {
        const [results] = await con.execute(query, dados)
        console.log("Resultado da consulta:", results.affectedRows, "linha(s) afetada(s).")
        return results;
    } catch (err) {
        console.error("Erro ao executar a query:", err.message)
        throw err
    } finally {
        await con.end()
    }
}
