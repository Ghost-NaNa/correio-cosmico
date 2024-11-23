import { fileURLToPath } from "url"
import { dirname } from "path"
import express from "express"
import session from "express-session"
import bodyParser from "body-parser"
import path from "path"
import ejs from "ejs"

import { conexao } from "./DAO/conexao.js" 
import routes from "./src/routes/mainRoutes.js"



const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

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


routes(app)

const port = 3000

const pool = conexao()


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
