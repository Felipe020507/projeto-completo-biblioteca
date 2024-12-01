document.addEventListener('DOMContentLoaded', function() {
    const formContato = document.getElementById('form-contato');
    const mensagemSucesso = document.getElementById('mensagem-sucesso');

    formContato.addEventListener('submit', function(event) {
        event.preventDefault();  

        formContato.style.display = 'none';

        mensagemSucesso.style.display = 'block';
    });
});
