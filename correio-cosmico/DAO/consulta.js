import conexao from "./conexao.js";

export async function buscaTabela(query, params = []) {
    console.log("Query:", query);
    const pool = conexao(); // Utiliza o pool de conexões

    try {
        // Executa a consulta utilizando o pool e os parâmetros
        const [rows, fields] = await pool.execute(query, params);

        console.log("Resultados:", rows);
        return rows; // Retorna os resultados da consulta
    } catch (err) {
        // Retorna a mensagem de erro caso algo dê errado
        console.error('Erro ao consultar a tabela:', err.message);
        return err.message;
    }
}
