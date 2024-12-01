package com.example.bibliotecavirtual.service;

import com.example.bibliotecavirtual.model.Livro;
import com.example.bibliotecavirtual.repository.LivroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LivroService {

    @Autowired
    private LivroRepository livroRepository;

    // Adicionar livro
    public void adicionarLivro(Livro livro) {
        livroRepository.save(livro);  // Salva o livro no banco de dados
    }

    // Listar todos os livros
    public List<Livro> listarLivros() {
        return livroRepository.findAll();  // Retorna todos os livros armazenados
    }

    // Remover livro por ID
    public void removerLivro(Long livroId) {
        if (livroRepository.existsById(livroId)) {
            livroRepository.deleteById(livroId);  // Remove diretamente pelo ID
        } else {
            throw new RuntimeException("Livro não encontrado com o ID: " + livroId);
        }
    }
}
