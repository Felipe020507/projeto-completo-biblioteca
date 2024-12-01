document.getElementById("barra-pesquisa").addEventListener("input", async function () {
    const query = this.value.trim();
    const resultadosContainer = document.getElementById("resultados");
    resultadosContainer.innerHTML = ""; 

    if (query.length < 3) {
        resultadosContainer.style.display = "none";
        return;
    }

    try {
        
        const responseOL = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`);
        const dataOL = await responseOL.json();

        
        const responseGB = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
        const dataGB = await responseGB.json();

        
        if (dataOL.docs.length > 0) {
            
            dataOL.docs.slice(0, 5).forEach(livro => {
                const li = document.createElement("li");
                li.textContent = livro.title;
                li.onclick = () => selecionarLivro(livro, 'OL');
                resultadosContainer.appendChild(li);
            });
        }

        
        if (dataGB.items) {
            dataGB.items.slice(0, 5).forEach(item => {
                const li = document.createElement("li");
                li.textContent = item.volumeInfo.title;
                li.onclick = () => mostrarDetalhesLivroGoogle(item); 
                resultadosContainer.appendChild(li);
            });
        }

        if (resultadosContainer.innerHTML !== "") {
            resultadosContainer.style.display = "block";
        } else {
            resultadosContainer.style.display = "none";
        }

    } catch (error) {
        console.error("Erro ao buscar livros:", error);
    }
});


function selecionarLivro(livro, source) {
    if (source === 'OL') {
        mostrarDetalhesLivroOpenLibrary(livro);
    }
}


function mostrarDetalhesLivroOpenLibrary(livro) {
    const detalhes = document.getElementById("detalhes-livro");
    detalhes.innerHTML = `
        <div class="capa-e-botao">
            <img src="https://covers.openlibrary.org/b/id/${livro.cover_i}-M.jpg" alt="Capa do Livro" class="capa-livro">
            <button onclick="adicionarItem('${livro.title}', '${livro.cover_i}', '${livro.first_publish_year}', '${livro.isbn ? livro.isbn[0] : ""}')" class="botao-adicionar">Adicionar Livro</button>
        </div>
        <div class="descricao">
            <h3>${livro.title}</h3>
            <p><strong>Autor:</strong> ${livro.author_name ? livro.author_name.join(", ") : "Autor desconhecido"}</p>
            <p><strong>Data de Publicação:</strong> ${livro.first_publish_year || "Não disponível"}</p>
            <p><strong>ISBN:</strong> ${livro.isbn ? livro.isbn[0] : "Não disponível"}</p>
            <p><strong>ISBN10:</strong> ${livro.isbn && livro.isbn.length > 1 ? livro.isbn[1] : "Não disponível"}</p>
            <p><strong>Descrição:</strong> ${livro.subject ? livro.subject.join(", ") : "Sem descrição disponível"}</p>
        </div>
    `;
}


function adicionarItem(titulo, imagem, dataPublicacao, isbn) {
   
    const dataEmprestimo = new Date();
    const dataDevolucao = calcularDataDevolucao(dataEmprestimo); 

   
    const livro = {
        titulo: titulo,
        imagem: `https://covers.openlibrary.org/b/id/${imagem}-M.jpg`, 
        dataPublicacao: dataPublicacao,
        isbn: isbn,
        usuario: localStorage.getItem("usuarioLogado"), 
        dataEmprestimo: dataEmprestimo.toISOString().split('T')[0], 
        dataDevolucao: dataDevolucao.toISOString().split('T')[0] 
    };

    
    let livrosAdicionados = JSON.parse(localStorage.getItem("livrosAdicionados")) || [];
    livrosAdicionados.push(livro);
    localStorage.setItem("livrosAdicionados", JSON.stringify(livrosAdicionados));

    
    console.log("Livro adicionado ao localStorage:", livro);
    console.log("Lista de livros armazenados:", livrosAdicionados);

    alert(`Livro "${titulo}" adicionado à sua lista!`);

    salvarNoBanco(livro); 
}

function calcularDataDevolucao(dataEmprestimo) {
    const dataDevolucao = new Date(dataEmprestimo);
    dataDevolucao.setDate(dataDevolucao.getDate() + 30); 

    return dataDevolucao;
}



async function salvarNoBanco(livro) {
    try {
        const response = await fetch("https://back-end-biblioteca-production.up.railway.app/api/livros/adicionar", {
            method: 'POST',  
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(livro)  
        });

        if (response.ok) {
            console.log('Livro adicionado ao banco de dados com sucesso');
        } else {
            console.error('Erro ao salvar o livro no banco de dados');
        }
    } catch (error) {
        console.error("Erro ao comunicar com o backend:", error);
    }
}


function mostrarDetalhesLivroGoogle(item) {
    const detalhes = document.getElementById("detalhes-livro");
    const livro = item.volumeInfo;

    detalhes.innerHTML = `
        <div class="capa-e-botao">
            <img src="${livro.imageLinks ? livro.imageLinks.thumbnail : 'default.jpg'}" alt="Capa do Livro" class="capa-livro">
            <button onclick="adicionarItem('${livro.title}', '${livro.imageLinks ? livro.imageLinks.thumbnail : ''}', '${livro.publishedDate}', '${livro.industryIdentifiers ? livro.industryIdentifiers[0].identifier : ""}')" class="botao-adicionar">Adicionar Livro</button>
        </div>
        <div class="descricao">
            <h3>${livro.title}</h3>
            <p><strong>Autor:</strong> ${livro.authors ? livro.authors.join(", ") : "Autor desconhecido"}</p>
            <p><strong>Data de Publicação:</strong> ${livro.publishedDate || "Não disponível"}</p>
            <p><strong>ISBN:</strong> ${livro.industryIdentifiers ? livro.industryIdentifiers[0].identifier : "Não disponível"}</p>
            <p><strong>Descrição:</strong> ${livro.description || "Sem descrição disponível"}</p>
        </div>
    `;
}
