<?php
// Incluir o arquivo de conexão
include('conexao.php');

// Definir variáveis de erro e sucesso
$erro = '';
$sucesso = '';

// Verificar se os dados do formulário foram enviados via POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Sanitizar os dados recebidos do formulário
    $nome = htmlspecialchars($_POST['nome']);
    $senha = password_hash($_POST['senha'], PASSWORD_DEFAULT); // Criptografando a senha

    // Verificar se o nome de usuário já existe no banco
    $sqlCheck = "SELECT COUNT(*) FROM tb_users WHERE name_user = :nome";
    $stmtCheck = $pdo->prepare($sqlCheck);
    $stmtCheck->execute([':nome' => $nome]);
    $userExists = $stmtCheck->fetchColumn(); // Verifica se há algum usuário com esse nome

    if ($userExists > 0) {
        // Se o nome de usuário já existir, impedir o cadastro e mostrar mensagem
        $erro = "Erro: O nome de usuário já está registrado. Por favor, escolha outro.";
    } else {
        // Preparar a query de inserção, pois o nome de usuário é único
        $sqlInsert = "INSERT INTO tb_users (name_user, senha_user) VALUES (:nome, :senha)";
        $stmtInsert = $pdo->prepare($sqlInsert);

        try {
            // Executar a query de inserção, passando os dados como parâmetros
            $stmtInsert->execute([
                ':nome' => $nome,
                ':senha' => $senha
            ]);

            header('Location: ../../../front/index.html');
        } catch (PDOException $e) {
            // Mensagem de erro ao tentar inserir
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
    <title>Cadastro de Usuário</title>
</head>
<body>
    <h2>Cadastro de Usuário</h2>
    
    <!-- Exibindo mensagens de erro ou sucesso -->
    <?php if ($erro): ?>
        <p style="color: red;"><?php echo $erro; ?></p>
    <?php endif; ?>


    <!-- Formulário de cadastro -->
    <form action="" method="POST">
        <label for="nome">Seu nome:</label>
        <input type="text" id="nome" name="nome" required><br><br>

        <label for="senha">Senha:</label>
        <input type="password" id="senha" name="senha" required><br><br>

        <button type="submit">Cadastrar</button>
    </form>
</body>
</html>
