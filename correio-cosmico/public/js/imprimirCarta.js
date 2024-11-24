const cartaContainer = document.querySelector('.containerCartas')

document.addEventListener('DOMContentLoaded', fetchCartaAleatoria);
document.getElementById('trocarCartaBtn').addEventListener('click', fetchCartaAleatoria);

function fetchCartaAleatoria() {
    fetch('http://localhost:3000/api/cartaaleatoria', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        return response.json()
    })
    .then(data => {
        console.log('Resposta da API:', data);
        renderCarta(data);
    })
}

function renderCarta(carta) {
    if (!carta) {
        console.error('Nenhuma carta disponível para exibir.');
        return;
    }
    cartaContainer.innerHTML = `
        <div class="carta">
            <h2>${carta.titulo_carta}</h2>
            <p>${carta.conteudo_carta}</p>
            <small>Data criada: ${new Date(carta.data_carta).toLocaleDateString()}</small>
            <br>
            <small>Expira em: ${new Date(carta.data_expira_carta).toLocaleDateString()}</small>
        </div>
    `;
}

