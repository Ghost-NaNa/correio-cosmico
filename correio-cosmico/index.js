import { fileURLToPath } from "url"
import { dirname } from "path"
import express from "express"
import session from "express-session"
import bodyParser from "body-parser"
import path from "path"
import ejs from "ejs"

import conexao from "./DAO/conexao.js" 
import { buscaTabela } from "./DAO/consulta.js"
import { incluirDados } from "./DAO/conexao.js"

const app = express()
const port = 3000
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const pool = conexao()

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

        if (data[0].email_user == email && data[0].senha_user == senha) {
            // Login bem-sucedido
            console.log("dados consultados:" + data[0].email_user + data[0].name_user)

            req.session.login = data[0].email_user
            req.session.name = data[0].name_user
            res.render("index", {
                login: email,
                name: data[0].name_user
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

        res.render("index", { login: req.session.name })
    } else {
        res.render("login")
    }
})


app.post("/cadastro", async (req, res) => {
    const {nome, email, senha} = req.body

    // console.log(nome, email, senha)

    try {
        console.log(`${nome}asd${email}asd${senha}`)

        const data = await incluirDados('tb_users', [nome, email, senha])
        res.redirect('/')
    } catch (error) {
        console.log(`deu pau ${error}`)
    }
})

app.get("/cadastro", (req, res) => {
    res.render('cadastro')
})


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
