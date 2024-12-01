let livros = [];
async function verificarConexao() {
    try {
        const url = 'https://www.googleapis.com/books/v1/volumes?q=popular&maxResults=1'; 
        const resposta = await fetch(url);
        
        if (!resposta.ok) {
            throw new Error('Falha ao conectar com a API: ' + resposta.statusText);
        }

        console.log('Conexão bem-sucedida com a API.');
        return true;
    } catch (erro) {
        console.error('Erro ao tentar se conectar com a API:', erro);
        return false;
    }
}

function limitarTitulo(titulo, maxLength = 50) {
    if (titulo.length > maxLength) {
        return titulo.slice(0, maxLength) + '...';
    }
    return titulo;
}

async function buscarLivros(query = '') {
    try {
        const url = query
            ? `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=40`
            : 'https://www.googleapis.com/books/v1/volumes?q=book&maxResults=40'; 
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao buscar livros: ' + response.statusText);
        }
        const data = await response.json();

        console.log('Resposta da API:', data); 
        if (!data.items || !Array.isArray(data.items)) {
            console.warn('Dados não encontrados na resposta da API ou formato inesperado', data);
            return;
        }

        livros = data.items.map(livro => ({
            titulo: limitarTitulo(livro.volumeInfo.title), 
            capa: livro.volumeInfo.imageLinks ? livro.volumeInfo.imageLinks.thumbnail : 'capa-default.jpg' 
        }));

        if (livros.length === 0) {
            console.log('Nenhum livro encontrado na resposta.');
        }

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

    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(pesquisa)}&maxResults=100`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao buscar livros: ' + response.statusText);
        }
        const data = await response.json();

        console.log('Resposta da pesquisa:', data); 

        if (!data.items || !Array.isArray(data.items)) {
            console.warn('Dados não encontrados na resposta da API ou formato inesperado', data);
            return;
        }

        const livrosEncontrados = data.items.map(livro => ({
            titulo: limitarTitulo(livro.volumeInfo.title), 
            capa: livro.volumeInfo.imageLinks ? livro.volumeInfo.imageLinks.thumbnail : 'capa-default.jpg' 
        }));

        if (livrosEncontrados.length === 0) {
            exibirLivros([]); 
        } else {
            exibirLivros(livrosEncontrados);
        }
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

document.addEventListener('DOMContentLoaded', async () => {
    const conectado = await verificarConexao(); 
    if (conectado) {
        buscarLivros();
    } else {
        console.log('Impossível carregar livros. Não há conexão com a API.');
    }
});
