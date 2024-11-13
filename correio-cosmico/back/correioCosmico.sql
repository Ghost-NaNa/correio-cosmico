CREATE DATABASE correioCosmico;
USE correioCosmico;

CREATE TABLE tb_users (
	id_user INT AUTO_INCREMENT PRIMARY KEY,
    senha_user VARCHAR(20) NOT NULL,
    name_user VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE tb_cartas (
	id_carta INT AUTO_INCREMENT PRIMARY KEY,
    usuario_carta INT NOT NULL,
    titulo_carta VARCHAR(25) NOT NULL,
    conteudo_carta VARCHAR(300) NOT NULL,
    
    FOREIGN KEY (usuario_carta) REFERENCES tb_users(id_user)
);

SELECT * from tb_users;