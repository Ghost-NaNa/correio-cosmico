<?php
// Incluir o arquivo de conexão
include('./conexao.php');

// Definir variáveis de erro e sucesso
$erro = '';

// Verificar se os dados do formulário foram enviados via POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Sanitizar os dados recebidos do formulário
    $email = htmlspecialchars($_POST['email']);
    $senha = htmlspecialchars($_POST['senha']); // Senha fornecida pelo usuário

    // Consultar o banco de dados para verificar o email e senha
    $sql = "SELECT id_user, senha_user FROM tb_users WHERE email_user = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':email' => $email]);
    
    // Verificar se o usuário existe
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // Depuração: Verifique os valores antes de comparar
        // var_dump(md5($senha)); // Exibe o hash MD5 da senha fornecida
        // var_dump($user['senha_user']); // Exibe o valor da senha armazenada no banco

        // Comparar a senha fornecida com a senha no banco (senha criptografada com MD5)
        // Certifique-se de remover espaços extras antes da comparação
        if (md5(trim($senha)) == trim($user['senha_user'])) {
            // Senha correta, armazena o ID do usuário em um cookie
            setcookie('user_id', $user['id_user'], time() + 3600, "/"); // O cookie expira em 1 hora
            header('Location: dashboard.php'); // Redireciona para uma página de sucesso
            exit;
        } else {
            // Senha incorreta
            $erro = 'Senha incorreta.';
        }
    } else {
        // Usuário não encontrado
        $erro = 'Usuário não encontrado.';
    }
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="./assets/styles/login.css">
</head>
<body>
    <div class="login-container">
        <div class="login-box">
            <h2>Bem-vindo de volta! <br>Faça seu login</h2>
            <form action="" method="POST">
                <div class="floating-label">
                    <input name="email" type="email" id="email" placeholder=" " required>
                    <label for="email">Seu email</label>
                </div>
                <div class="floating-label">
                    <input name="senha" type="password" id="senha" placeholder=" " required>
                    <label for="senha">Senha</label>
                    <span class="fa-regular fa-eye" id="toggle-password" onclick="togglePasswordVisibility()"></span>
                </div>
                <?php if ($erro): ?>
                    <p style="color: red;"><?php echo $erro; ?></p>
                <?php endif; ?>
                <button type="submit" class="login-button">LOGIN</button>
                <p class="signup-text">Ainda não tem uma conta? <a href="./cadastro.php">Clique aqui</a></p>
            </form>
        </div>
    </div>

    <script src="./assets/scripts/btn_form.js"></script>
    <script src="https://kit.fontawesome.com/735a316080.js" crossorigin="anonymous"></script>
</body>
</html>
