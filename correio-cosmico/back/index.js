import { fileURLToPath } from "url";
import { dirname } from "path";
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import path from "path";
import ejs from "ejs";
import conexao from "./DAO/conexao.js"; // Importa a conexão com o banco
import { buscaTabela } from "./DAO/consulta.js"; // Função para consulta no banco

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = conexao(); // Inicializa o pool de conexões

// Configuração do motor de visualização
app.use(
    session({
        secret: "chave_secreta",
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            maxAge: 60000, // Sessão dura 1 minuto
        },
    })
);

app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.use(express.json());

// Rota para autenticação
app.post("/", async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Busca o usuário no banco de dados, agora incluindo o nome
        const data = await buscaTabela(
            "SELECT * FROM tb_users WHERE email_user = ? AND senha_user = ?",
            [email, senha]
        );
        console.log(data);

        if (data.length > 0) {
            // Login bem-sucedido
            const user = data[0]
            req.session.login = user.email_user;
            req.session.name = user.name_user
            res.render("index")
        } else {
            // Dados inválidos
            res.render("login", { error: "Email ou senha inválidos" });
        }
    } catch (error) {
        console.error("Erro ao consultar o banco:", error);
        res.render("login", { error: "Erro interno no servidor" });
    }
});

// Rota para a página inicial
app.get("/", (req, res) => {
    if (req.session.login) {
        // Exibe o nome na página inicial
        res.render("index", { login: req.session.name });
    } else {
        // Se o usuário não estiver logado, redireciona para o login
        res.render("login");
    }
});

// Finaliza o pool de conexões ao encerrar o servidor
process.on("SIGINT", async () => {
    try {
        await pool.end();
        console.log("Conexão com o banco de dados encerrada.");
    } catch (err) {
        console.error("Erro ao encerrar o pool de conexões:", err);
    } finally {
        process.exit(0);
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
