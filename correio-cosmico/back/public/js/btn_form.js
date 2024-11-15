function togglePasswordVisibility() {
    const passwordInput = document.getElementById("senha");
    const isPassword = passwordInput.type === "password"; // Se for "password", significa que está oculto

    // Usando o valor de isPassword diretamente para decidir a visibilidade do ícone
    trocarIcone(isPassword);

    // Alternando o tipo de input entre "password" e "text"
    passwordInput.type = isPassword ? "text" : "password";
}

function trocarIcone(isPasswordVisible) {
    let span = document.querySelector('#toggle-password');

    // Se o campo está como senha (oculto), mostramos o ícone "eye-slash", caso contrário, mostramos o "eye"
    if (isPasswordVisible) {
        span.classList.remove('fa-eye');
        span.classList.add('fa-eye-slash');
    } else {
        span.classList.remove('fa-eye-slash');
        span.classList.add('fa-eye');
    }
}
