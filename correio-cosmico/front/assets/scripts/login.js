
document.querySelector("#loginForm").addEventListener("submit", async function(event) {
    event.preventDefault() // Evita o envio padrão do formulário

    const messageElement = document.querySelector(".message")

    const body = {
        email: document.querySelector("#email").value,
        senha: document.querySelector("#senha").value
    }

    // Verificação de campos vazios
    if (!email || !senha) {
        messageElement.style.color = "#ff6b6b"
        messageElement.textContent = "Email e senha são obrigatórios."
        return // Impede o envio se os campos estiverem vazios
    }

    try {
        // Envia a requisição para o servidor Express
        await fetch("http://localhost:3000/login", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })

        .then(response => {
            return response.json()
        })

        .then(response => {
            console.log(response)
        })

        .then(body => {
            console.log(body)
        })

        

    } catch (error) {
        console.error("Erro no login:", error) // Log do erro
        messageElement.style.color = "#ff6b6b"
        messageElement.textContent = "Erro de conexão com o servidor."
    }
})
