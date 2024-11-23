import { incluirDados } from "../../DAO/conexao.js"
import { buscarCartas, buscaTabela } from "../../DAO/consulta.js"

export async function exibirLinks(req, res) {
    res.render("main");
} 

export async function fazerLogin(req, res) {
    const { email, senha } = req.body

    console.log('tentando cadastrar...')

    try {
        const data = await buscaTabela(
            "SELECT * FROM tb_users WHERE email_user = ? AND senha_user = ?",
            [email, senha]
        )

        console.log("login feito com sucesso")

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
} 

export async function verificarLogin(req, res) {
    console.log('verificando login...')

    if (req.session.login) {
        console.log('Usuário já tem um login efetuado')

        res.render("index", { 
            //  oia eu usando as variáveis
            name: req.session.name,
            id: req.session.user_id
         })
         id = req.session.user_id
    } else {
        console.log('Usuário não tem um login')
        res.render("login")
    }
}

export async function loadCadastro(req, res) {
    console.log('Carrengando cadastro')
    res.render('cadastro')
}

export async function cadastrar(req, res) {
    const { nome, email, senha } = req.body

    console.log('Tentando cadastrar')
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
}

export async function loadCarta(req, res) {
    res.render('formCarta')
}

export async function loadCartasPorId(req, res) {
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
}

export async function postarCarta(req, res) {
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

}

export async function verificarUser(req, res) {
    if (req.session && req.session.user_id) {
        res.json({
            id: req.session.user_id,
            email: req.session.email,
            name: req.session.name,
        });
    } else {
        res.status(401).json({ error: "Usuário não autenticado" });
    }
}
