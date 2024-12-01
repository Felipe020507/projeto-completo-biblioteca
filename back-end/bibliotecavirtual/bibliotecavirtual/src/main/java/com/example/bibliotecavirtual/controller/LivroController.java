package com.example.bibliotecavirtual.controller;

import com.example.bibliotecavirtual.model.Livro;
import com.example.bibliotecavirtual.service.LivroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/livros")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class LivroController {

    @Autowired
    private LivroService livroService;

    // Adicionar livro
    @PostMapping("/adicionar")
    public ResponseEntity<String> adicionarLivro(@RequestBody Livro livro) {
        // Garante que as datas obrigatórias sejam definidas no backend
        if (livro.getDataEmprestimo() == null) {
            livro.setDataEmprestimo(java.sql.Date.valueOf(LocalDate.now()));
        }
        if (livro.getDataDevolucao() == null) {
            livro.setDataDevolucao(java.sql.Date.valueOf(LocalDate.now().plusDays(30)));
        }

        livroService.adicionarLivro(livro);
        return ResponseEntity.ok("Livro adicionado com sucesso!");
    }

    // Listar livros
    @GetMapping
    public ResponseEntity<List<Livro>> listarLivros() {
        List<Livro> livros = livroService.listarLivros();
        return ResponseEntity.ok(livros);
    }

    // Confirmar livro e mostrar período de empréstimo
    @PostMapping("/confirmar/{livroId}")
    public ResponseEntity<String> confirmarLivro(@PathVariable Long livroId) {
        LocalDate hoje = LocalDate.now();
        LocalDate devolucao = hoje.plusDays(30); // Define o período de empréstimo
        return ResponseEntity.ok("Livro confirmado! Período de empréstimo: de " + hoje + " até " + devolucao);
    }

    // Remover livro
    @DeleteMapping("/remover/{livroId}")
    public ResponseEntity<String> removerLivro(@PathVariable Long livroId) {
        livroService.removerLivro(livroId);
        return ResponseEntity.ok("Livro removido com sucesso!");
    }
}
