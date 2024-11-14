<?php
$host = 'localhost'; // ou o IP do seu servidor MySQL
$dbname = 'correioCosmico';
$username = 'root'; // seu usuário MySQL
$password = ''; // sua senha MySQL

try {
    // Criando a conexão
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    // Definindo o modo de erro do PDO para exceções
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Caso haja erro na conexão
    die("Erro ao conectar ao banco de dados: " . $e->getMessage());
}
?>
