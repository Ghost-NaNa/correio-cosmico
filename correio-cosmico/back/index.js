import express from "express";
import { buscaTabela } from "./DAO/consulta.js"
import cors from "cors"
import md5 from "md5";

const app = express();
const port = 3000

app.use(cors({
    origin: '*'
}))

app.use(express.json()); // Permite trabalhar com JSON no Express

app.listen(port, () => {
    console.log(`verifique localhost:${port}`)
})

app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    try {
        // Consulta SQL para buscar o usuário pelo email
        const query = `SELECT id_user, senha_user FROM tb_users WHERE email_user = '${email}'`;
        const [result] = await buscaTabela(query);

        if (result.length === 0) {
            // Caso o usuário não seja encontrado
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        const user = result[0];

        // Criptografa a senha fornecida pelo usuário
        const senhaCriptografada = md5(senha.trim());

        // Verifica se a senha fornecida corresponde à senha armazenada no banco (criptografada)
        if (senhaCriptografada === user.senha_user.trim()) {
            // Login bem-sucedido, devolve o ID do usuário
            return res.status(200).json({ message: "Login bem-sucedido", userId: user.id_user });
        } else {
            // Senha incorreta
            return res.status(401).json({ error: "Senha incorreta" });
        }
    } catch (error) {
        // Erro de conexão ou consulta
        return res.status(500).json({ error: "Erro interno do servidor", details: error.message });
    }
});

