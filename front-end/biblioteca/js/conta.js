document.addEventListener("DOMContentLoaded", function() {
    fetchLivros();
});

function fetchLivros() {
    fetch('https://back-end-biblioteca-production.up.railway.app/api/livros')
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const livrosContainer = document.getElementById("livros-container");
                livrosContainer.innerHTML = ""; 

                data.forEach(livro => {
                    const livroElement = document.createElement("div");
                    livroElement.classList.add("livro-item");
                    livroElement.setAttribute("data-id", livro.id); 

                    const livroNome = document.createElement("p");
                    livroNome.textContent = livro.titulo;

                    const datasContainer = document.createElement("div");
                    datasContainer.classList.add("datas");
                    datasContainer.style.display = "none"; 

                   
                    const emprestimoText = document.createElement("span");
                    emprestimoText.classList.add("data-emprestimo");
                    emprestimoText.innerHTML = "<strong>Empréstimo:</strong> --/--/----";

                    const devolucaoText = document.createElement("span");
                    devolucaoText.classList.add("data-devolucao");
                    devolucaoText.innerHTML = "<strong>Devolução:</strong> --/--/----";

                   
                    datasContainer.appendChild(emprestimoText);
                    datasContainer.appendChild(devolucaoText);

                    
                    const confirmarButton = document.createElement("button");
                    confirmarButton.textContent = "Confirmar";
                    confirmarButton.classList.add("confirmar");
                    confirmarButton.onclick = () => confirmarLivro(livro.id, livroElement, datasContainer);

                    const removerButton = document.createElement("button");
                    removerButton.textContent = "Remover";
                    removerButton.classList.add("remover");
                    removerButton.onclick = () => removerLivro(livro.id);

                    livroElement.appendChild(livroNome);
                    livroElement.appendChild(confirmarButton);
                    livroElement.appendChild(removerButton);
                    livroElement.appendChild(datasContainer); 

                
                    livrosContainer.appendChild(livroElement);
                });
            }
        })
        .catch(error => console.error('Erro ao carregar os livros:', error));
}

function confirmarLivro(livroId, livroElement, datasContainer) {
    const emprestimo = new Date();
    const devolucao = new Date(emprestimo);
    devolucao.setDate(emprestimo.getDate() + 7); 

    const dataEmprestimoElement = datasContainer.querySelector(".data-emprestimo");
    const dataDevolucaoElement = datasContainer.querySelector(".data-devolucao");

    dataEmprestimoElement.textContent = "Empréstimo: " + emprestimo.toLocaleDateString();
    dataDevolucaoElement.textContent = "Devolução: " + devolucao.toLocaleDateString();

    datasContainer.style.display = "flex"; 

    const confirmarButton = livroElement.querySelector(".confirmar");
    const removerButton = livroElement.querySelector(".remover");

    confirmarButton.style.display = "none";
    removerButton.style.display = "none";
}


function removerLivro(livroId) {
    const livroElement = document.querySelector(`.livro-item[data-id="${livroId}"]`);

    fetch(`https://back-end-biblioteca-production.up.railway.app/api/livros/remover/${livroId}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                livroElement.remove();
            } else {
                console.error("Erro ao remover o livro do banco.");
            }
        })
        .catch(error => console.error('Erro ao remover o livro:', error));
}
