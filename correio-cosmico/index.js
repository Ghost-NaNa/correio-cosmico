import { fileURLToPath } from "url"
import { dirname } from "path"
import express from "express"
import session from "express-session"
import bodyParser from "body-parser"
import path from "path"
import ejs from "ejs"

import conexao from "./DAO/conexao.js" 
import { buscarCartas, buscaTabela } from "./DAO/consulta.js"
import { incluirDados } from "./DAO/conexao.js"

const app = express()
const port = 3000
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const pool = conexao()
let id = null

app.use(
    session({
        secret: "chave_secreta",
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            maxAge: 300000, // Sessão dura 5 minutos, um minuto era muito poico
        },
    })
)


app.engine("html", ejs.renderFile)
app.set("view engine", "html")
app.use("/public", express.static(path.join(__dirname, "public")))
app.use(bodyParser.urlencoded({ extended: true }))
app.set("views", path.join(__dirname, "views"))
app.use(express.json())

// Rota para autenticação
app.post("/", async (req, res) => {
    const { email, senha } = req.body

    try {
        const data = await buscaTabela(
            "SELECT * FROM tb_users WHERE email_user = ? AND senha_user = ?",
            [email, senha]
        )

        console.log("id do usuário: " + data[0].id_user)

        if (data[0].email_user == email && data[0].senha_user == senha) {
            // Login bem-sucedido

            // variáveis da sessão, por assim dizer
            req.session.user_id = data[0].id_user
            req.session.email = data[0].email_user
            req.session.name = data[0].name_user
            res.render("formCarta", {
                email: email,
                name: data[0].name_user,
                id: data[0].id_user

            })
        } else {
            // Dados inválidos
            res.render("login", { error: "Email ou senha inválidos" })
        }
    } catch (error) {
        console.error("Erro ao consultar o banco:", error)
        res.render("login", { erro: "Erro interno no servidor" })
    }
})

// Rota para a página inicial
app.get("/", (req, res) => {
    if (req.session.login) {

        res.render("index", { 
            //  oia eu usando as variáveis
            name: req.session.name,
            id: req.session.user_id
         })
         id = req.session.user_id
    } else {
        res.render("login")
    }
})

app.post("/cadastro", async (req, res) => {
    const { nome, email, senha } = req.body

    try {

        const usuariosExistentes = await buscaTabela(
            `SELECT * FROM tb_users WHERE name_user = ? OR email_user = ?`,
             [nome, email])

        if (usuariosExistentes.length > 0) {
            // depoir melhoro isso
            return res.status(400).send("Nome de usuário ou email já está em uso")
        }

        // Inserir novo usuário no banco de dados
        await incluirDados("tb_users", [nome, email, senha], ["name_user", "email_user", "senha_user"])

        console.log("Usuário cadastrado com sucesso!")
        res.redirect("/")
    } catch (error) {
        console.error(`Erro ao cadastrar usuário: ${error}`)
        res.status(500).render("cadastro", {
            mensagem: "Erro interno no servidor",
        })
    }
})


app.get("/cadastro", (req, res) => {
    res.render('cadastro')
})

app.get("/formcarta", (req, res) => {
    res.render('formCarta')
});


// tá aqui sua função Gabriel, beijin na bunda (Nathan, tu é mt tchola)
app.get("/cartas", async (req, res) => {
    const userId = req.session.user_id;

    if (!userId) {
        return res.status(401).send({ message: "Usuário não autenticado" });
    }

    try {
        const cartas = await buscarCartas(userId);

        if (cartas.length > 0) {
            return res.status(200).json(cartas);
        } else {
            return res.status(404).send({ message: "Nenhuma carta encontrada para este usuário." });
        }
    } catch (error) {
        console.error("Erro ao buscar cartas:", error);
        return res.status(500).send({ message: "Erro interno no servidor" });
    }
})

//Criei o post, me custou 2 horas de vida pra fazer pegar direito, não mexe nele sem saber oq vc tá fazendo
app.post("/api/postcarta", (req, res) => {
    const { titulo_carta, conteudo_carta } = req.body;

    const usuario_carta = req.session.user_id;

    if (!usuario_carta) {
        return res.status(401).send("Usuário não autenticado.");
    }

    if (!titulo_carta || !conteudo_carta) {
        return res.status(400).send("Título e conteúdo são obrigatórios.");
    }

    const data_carta = new Date();
    const data_expira_carta = new Date(data_carta);
    data_expira_carta.setDate(data_carta.getDate() + 3); 

    incluirDados("tb_cartas", [usuario_carta, titulo_carta, conteudo_carta, data_carta, data_expira_carta], ["usuario_carta", "titulo_carta", "conteudo_carta", "data_carta", "data_expira_carta"])

});



// Rota para pegar os dados, tenho certeza que esse é de longe o jeito menos seguro de se fazer isso
app.get("/api/user", (req, res) => {
    if (req.session && req.session.user_id) {
        res.json({
            id: req.session.user_id,
            email: req.session.email,
            name: req.session.name,
        });
    } else {
        res.status(401).json({ error: "Usuário não autenticado" });
    }
});


// Finaliza o pool de conexões ao encerrar o servidor
process.on("SIGINT", async () => {
    try {
        await pool.end()
        console.log("Conexão com o banco de dados encerrada.")
    } catch (err) {
        console.error("Erro ao encerrar o pool de conexões:", err)
    } finally {
        process.exit(0)
    }
})

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})
