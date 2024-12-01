CREATE DATABASE biblioteca_virtual;

USE biblioteca_virtual;

-- Criação da tabela de livros
CREATE TABLE livros (
    id INT AUTO_INCREMENT PRIMARY KEY,  
    titulo VARCHAR(255) NOT NULL,       
    isbn VARCHAR(20),                   
    data_publicacao DATE,               
    data_emprestimo DATE,               
    data_devolucao DATE                
);


select * from livros;



