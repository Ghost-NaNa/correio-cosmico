import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from "express";
import session from "express-session";
import path from "path";
import ejs from 'ejs';

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuração do motor de visualização das páginas
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.use(express.json());



app.listen(port, (error) => {
    if (error) {
        console.log("Deu erro");
        return;
    }
    console.log(`Servidor rodando em http://localhost:${port}`);
});
