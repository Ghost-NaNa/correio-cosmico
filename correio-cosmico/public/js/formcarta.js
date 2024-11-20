
//Aprendi que o pegar pelo id é um tequinho mais rápido em perfomance (Não que mude mt)
const form = document.getElementById("carta-form");
const responseMessage = document.getElementById("mensagemResposta");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    fetch("http://localhost:3000/api/postcarta", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then((response) => response.text())
    .then((message) => {
        responseMessage.textContent = message;
        responseMessage.className = 'success'; 
    })
    .catch((error) => {
        responseMessage.textContent = "Erro denovo.";
        responseMessage.className = 'error';
        console.error(error);
    });
});