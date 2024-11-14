import conexao from "./conexao.js";

export async function buscaTabela(query) {
    
    console.log(query)
    const conn = conexao()
    
    try {
        // Executar a consulta
        const [rows, fields] = await conn.query(query);
        //console.log('Dados consultados', results.affectedRows);
        await conn.end()

        return [rows]

      } catch (err) {

        return err.menssage
      }
}