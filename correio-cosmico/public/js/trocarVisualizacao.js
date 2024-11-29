const formView = document.querySelector('.form-container')
const cartas = document.querySelector('.containerCartas')


const container = document.querySelector("#exibicao")
const btn = document.querySelector('#trocarElemento')

document.addEventListener('DOMContentLoaded', () => {
    cartas.style.display = 'block'
    formView.style.display = 'none'
})

btn.addEventListener('click', mudarExibicao)

// foi mais fácil brincar com os displays doq fazer um innerHTML
function mudarExibicao() {
    if (cartas.style.display == 'block') {

        cartas.style.display = 'none'
        formView.style.display = 'block'

        btn.textContent = 'ver cartas'
    } else if (cartas.style.display == 'none') {
        
        formView.style.display = 'none'
        cartas.style.display = 'block'

        btn.textContent = 'enviar uma carta'
    }
}