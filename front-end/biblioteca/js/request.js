let livros = [];

async function buscarLivros(query = '') {
    try {
        const url = query
            ? `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=100`
            : 'https://openlibrary.org/search.json?q=popular&limit=100';

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao buscar livros: ' + response.statusText);
        }
        const data = await response.json();

        if (!data.docs || !Array.isArray(data.docs)) {
            console.warn('Dados não encontrados na resposta da API ou formato inesperado', data);
            return;
        }

        livros = data.docs.map(livro => ({
            titulo: livro.title,
            capa: livro.cover_i ? `https://covers.openlibrary.org/b/id/${livro.cover_i}-L.jpg` : 'capa-default.jpg'
        }));

        exibirLivros(livros); 
    } catch (error) {
        console.error('Erro ao buscar livros:', error);
    }
}

function exibirLivros(livrosParaMostrar) {
    const container = document.getElementById('livros-container');
    container.innerHTML = ''; 

    if (livrosParaMostrar.length === 0) {
        const noBooksMessage = document.createElement('p');
        noBooksMessage.textContent = 'Nenhum livro encontrado.';
        container.appendChild(noBooksMessage);
        return;
    }

    livrosParaMostrar.forEach(livro => {
        const livroDiv = document.createElement('div');
        livroDiv.className = 'livro';

        const img = document.createElement('img');
        img.src = livro.capa;
        img.alt = `Capa do livro ${livro.titulo}`;

        const titulo = document.createElement('p');
        titulo.textContent = livro.titulo;

        livroDiv.appendChild(img);
        livroDiv.appendChild(titulo);
        container.appendChild(livroDiv);
    });
}

async function pesquisarLivros(pesquisa) {
    if (pesquisa.trim() === '') {
        exibirLivros(livros); 
        return;
    }

    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(pesquisa)}&limit=100`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao buscar livros: ' + response.statusText);
        }
        const data = await response.json();

        if (!data.docs || !Array.isArray(data.docs)) {
            console.warn('Dados não encontrados na resposta da API ou formato inesperado', data);
            return;
        }

        const livrosEncontrados = data.docs.map(livro => ({
            titulo: livro.title,
            capa: livro.cover_i ? `https://covers.openlibrary.org/b/id/${livro.cover_i}-L.jpg` : 'capa-default.jpg'
        }));

        exibirLivros(livrosEncontrados); 
    } catch (error) {
        console.error('Erro ao pesquisar livros:', error);
    }
}

function filtrarPorLetra(letra) {
    const livrosFiltrados = livros.filter(livro => livro.titulo.toLowerCase().startsWith(letra.toLowerCase()));
    exibirLivros(livrosFiltrados);
}

document.getElementById('botao-todos').addEventListener('click', () => {
    document.getElementById('barra-pesquisa').value = '';
    exibirLivros(livros); 
});

document.getElementById('barra-pesquisa').addEventListener('input', (event) => {
    pesquisarLivros(event.target.value); 
});

const letras = document.querySelectorAll('.alfabeto span');
letras.forEach(letra => {
    letra.addEventListener('click', () => {
        const letraSelecionada = letra.textContent; 
        filtrarPorLetra(letraSelecionada); 
    });
});

document.addEventListener('DOMContentLoaded', () => buscarLivros());


