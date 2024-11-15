<?php
// Incluir o arquivo de conexão
include('./conexao.php');

// Definir variáveis de erro e sucesso
$erro = '';
$sucesso = '';

// Verificar se os dados do formulário foram enviados via POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Sanitizar os dados recebidos do formulário
    $nome = htmlspecialchars($_POST['nome']);
    $email = htmlspecialchars($_POST['email']);
    $senha = htmlspecialchars($_POST['senha']);

    // Verificar se o nome de usuário já existe no banco
    $sqlCheck = "SELECT COUNT(*) FROM tb_users WHERE name_user = :nome";
    $stmtCheck = $pdo->prepare($sqlCheck);
    $stmtCheck->execute([':nome' => $nome]);
    $userExists = $stmtCheck->fetchColumn();

    if ($userExists > 0) {
        // Nome de usuário já existente
        $erro = "Erro: O nome de usuário já está registrado. Por favor, escolha outro.";
    } else {
        // Preparar a query de inserção com senha criptografada
        $hashedPassword = password_hash($senha, PASSWORD_DEFAULT);
        $sqlInsert = "INSERT INTO tb_users (email_user, name_user, senha_user) VALUES (:email, :nome, :senha)";
        $stmtInsert = $pdo->prepare($sqlInsert);

        try {
            // Executar a query de inserção
            $stmtInsert->execute([
                ':nome' => $nome,
                ':email' => $email,
                ':senha' => $hashedPassword
            ]);
            header('Location: ./login.html');
            exit;
        } catch (PDOException $e) {
            // Erro ao cadastrar o usuário
            $erro = "Erro ao cadastrar o usuário: " . $e->getMessage();
        }
    }
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro</title>
    <link rel="stylesheet" href="./assets/styles/login.css">
</head>
<body>
    <div class="login-container">
        <div class="login-box">
            <h2>Bem-vindo ao correio cósmico! <br>Faça seu cadastro</h2>
            <form action="" method="POST">
                <div class="floating-label">
                    <input name="nome" type="text" id="nome" placeholder=" " minlength="8" maxlength="20" required>
                    <label for="nome">Nome de usuário</label>
                    
                    <?php if ($erro): ?>
                        <p style="color: red;"><?php echo $erro; ?></p>
                    <?php endif; ?>
                </div>
                <div class="floating-label">
                    <input name="email" type="email" id="email" placeholder=" " required>
                    <label for="email">Seu email</label>
                </div>
                <div class="floating-label">
                    <input name="senha" type="password" id="senha" placeholder=" " required>
                    <label for="senha">Senha</label>
                    <span class="fa-regular fa-eye" id="toggle-password" onclick="togglePasswordVisibility()"></span>
                </div>
                <button type="submit" class="login-button">CADASTRAR</button>
                <p class="signup-text">Já tem uma conta? <a href="./login.php">Clique aqui</a></p>
            </form>
        </div>
    </div>

    <script src="./assets/scripts/btn_form.js"></script>
    <script src="https://kit.fontawesome.com/735a316080.js" crossorigin="anonymous"></script>
</body>
</html>
