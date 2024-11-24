import { conexao } from "./conexao.js"

//essa banalidade abaixo é para pegar uma linha aleatória de uma tabela
export async function dadoRandomTabela(tabela) {
    const pool = conexao();

    try {
        const queryTotal = `SELECT COUNT(*) AS total FROM ${tabela};`;
        const [rowsTotal] = await pool.query(queryTotal);
        const total = rowsTotal[0]?.total;

        if (total === 0) {
            throw new Error(`A tabela ${tabela} está vazia.`);
        }

        const Index = Math.floor(Math.random() * total);

        const queryLinha = `SELECT * FROM ${tabela} LIMIT 1 OFFSET ?;`;
        const [rowsLinha] = await pool.query(queryLinha, [Index]);

        if (rowsLinha.length === 0) {
            throw new Error('Nenhum registro encontrado na posição sorteada.');
        }

        return rowsLinha[0];
    } catch (error) {
        console.error('Erro ao buscar dado aleatório da tabela:', error);
        throw new Error('Não foi possível obter um registro aleatório.');
    }
}

export async function buscaTabela(query, params = []) {
    // console.log("Query:", query)
    const pool = conexao() // Utiliza o pool de conexões

    console.log('Tentando buscar no banco...')
    try {
        // Executa a consulta utilizando o pool e os parâmetros
        const [rows] = await pool.execute(query, params)

        console.log("Dados encontrados")
        return rows // Retorna os resultados da consulta
    } catch (erro) {
        // Retorna a mensagem de erro caso algo dê errado
        console.error('Erro ao consultar a tabela:', erro.message)
        return erro.message
    }
}

export async function buscarCartas(idUser) {
    const query = `
        SELECT 
            id_carta, 
            titulo_carta, 
            conteudo_carta, 
            data_carta, 
            data_expira_carta
        FROM 
            tb_cartas
        WHERE 
            usuario_carta = ?`

    const con = conexao()

    console.log('tentando buscar cartas...')
    try {
        const [rows] = await con.query(query, [idUser]) 
        return rows 
    } catch (err) {
        console.error("Erro ao buscar cartas:", err.message)
        return { error: err.message } 
    }
}