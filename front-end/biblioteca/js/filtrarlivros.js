let livros = []; // Variável global para armazenar os livros

async function buscarLivrosPorAssunto(assunto = '') {
    try {
        console.log("Buscando livros sobre o assunto:", assunto);
        const url = assunto 
            ? `https://openlibrary.org/search.json?subject=${encodeURIComponent(assunto)}&limit=100`
            : 'https://openlibrary.org/subjects/all.json?limit=10'; 

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

        console.log('Livros carregados:', livros);
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

function filtrarLivrosPorLetra(letra) {
    console.log("Filtrando livros com a letra:", letra);
    const livrosFiltrados = livros.filter(livro => livro.titulo.toLowerCase().startsWith(letra.toLowerCase()));
    exibirLivros(livrosFiltrados); 
}

const botaoTodos = document.querySelector('.alfabeto button');
botaoTodos.addEventListener('click', () => {
    exibirLivros(livros); 
});

function filtrarLivrosPorLetra(letra) {
    console.log("Filtrando livros com a letra:", letra);
    const livrosFiltrados = livros.filter(livro => livro.titulo.toLowerCase().startsWith(letra.toLowerCase()));
    exibirLivros(livrosFiltrados); 
}

const alfabeto = document.querySelectorAll('.alfabeto span');
alfabeto.forEach(letraElemento => {
    letraElemento.addEventListener('click', () => {
        filtrarLivrosPorLetra(letraElemento.textContent);
    });
});


async function buscarLivros(query = '') {
    try {
        const url = query 
            ? `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10` 
            : 'https://openlibrary.org/subjects/all.json?limit=10'; 

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

        console.log('Livros carregados:', livros);
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

function filtrarLivros(event) {
    const pesquisa = event.target.value.toLowerCase(); 
    console.log('Pesquisando por:', pesquisa); 

    if (pesquisa === '') {
        exibirLivros([]); 
        buscarLivros();
        return;
    }

    buscarLivros(pesquisa); 
}

document.getElementById('barra-pesquisa').addEventListener('input', filtrarLivros);
document.addEventListener('DOMContentLoaded', () => buscarLivros()); 


document.addEventListener('DOMContentLoaded', () => {
    buscarLivrosPorAssunto('science fiction'); 

    const alfabeto = document.querySelectorAll('.alfabeto span');
    alfabeto.forEach(letraElemento => {
        letraElemento.addEventListener('click', () => {
            filtrarLivrosPorLetra(letraElemento.textContent);
        });
    });
});
