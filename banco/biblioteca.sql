CREATE DATABASE biblioteca_virtual;

USE biblioteca_virtual;

-- Criação da tabela de livros
CREATE TABLE livros (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- ID único do livro
    titulo VARCHAR(255) NOT NULL,       -- Título do livro
    isbn VARCHAR(20),                   -- ISBN do livro (opcional)
    data_publicacao DATE,               -- Data de publicação do livro
    data_emprestimo DATE,               -- Data do empréstimo
    data_devolucao DATE                -- Data da devolução
);


select * from livros;



