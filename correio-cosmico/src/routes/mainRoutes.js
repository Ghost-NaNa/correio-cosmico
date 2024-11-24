import express from 'express'
import cors from 'cors'
import session from "express-session"
import bodyParser from "body-parser"
import path from "path"
import ejs from "ejs"

import { cadastrar, exibirLinks, fazerLogin, loadCadastro, loadCarta, loadCartasAleatorias, loadCartasPorId, postarCarta, verificarLogin, verificarUser } from '../controlers/postsControllers.js'

const corsOptions = {
    origin: "*",
    optionsSucessStatus: 200
}

const routes = (app) => {
    app.use(express.json());
    app.use(cors(corsOptions))

    // isso aqui tá só para testar as rotas
    app.get('/', exibirLinks)

    app.get('/login', verificarLogin);
    app.get('/cartas', loadCartasPorId);
    app.get('/cadastro', loadCadastro);
    app.get('/formcarta', loadCarta);
    app.get("/api/user", verificarUser);
    app.get('/api/cartaaleatoria', loadCartasAleatorias)

    app.post('/login', fazerLogin);
    app.post('/cadastro', cadastrar);

    //Criei o post, me custou 2 horas de vida pra fazer pegar direito, não mexe nele sem saber oq vc tá fazendo
    app.post('/api/postcarta', postarCarta)
     
}

export default routes;