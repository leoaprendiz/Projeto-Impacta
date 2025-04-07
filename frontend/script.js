let itemsPerPage;
let currentPage = 1;
let allGames = [];
let filteredGames = [];

// Define o número de itens por página baseado no tamanho da tela
function defineItemsPerPage() {
    const isMobile = window.innerWidth <= 770;
    itemsPerPage = isMobile ? 10 : 18;
}

document.addEventListener("DOMContentLoaded", () => {
    defineItemsPerPage();

    fetch('http://localhost:3000/games')
        .then(response => response.json())
        .then(data => {
            allGames = data;
            filteredGames = allGames;
            renderGames();
            renderPagination();
        })
        .catch(error => console.error("Erro ao carregar os jogos:", error));

    // Corrigido: ID do campo de busca
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();

            filteredGames = allGames.filter(game =>
                game.titulo.toLowerCase().includes(searchTerm) ||
                game.genero.toLowerCase().includes(searchTerm) ||
                game.ano_lancamento.toString().includes(searchTerm)
            );

            currentPage = 1;
            renderGames();
            renderPagination();
        });
    }
});

// Atualiza quantidade por página ao redimensionar
window.addEventListener("resize", () => {
    const oldItemsPerPage = itemsPerPage;
    defineItemsPerPage();
    if (oldItemsPerPage !== itemsPerPage) {
        currentPage = 1;
        renderGames();
        renderPagination();
    }
});

function renderGames() {
    const list = document.getElementById('games-list');
    list.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const gamesToShow = filteredGames.slice(start, end);

    gamesToShow.forEach(game => {
        const div = document.createElement('div');
        div.className = 'game';
        div.innerHTML = `
            <img src="${game.imagem}" alt="${game.titulo}">
            <h3 class="game-title">${game.titulo}</h3>
            <p class="game-genre">${game.genero}</p>
            <p class="game-year">${game.ano_lancamento}</p>
            <p>Preço: R$${game.preco}</p>
        `;
        list.appendChild(div);
    });

    // Mensagem de nenhum resultado
    let noResults = document.getElementById('no-results');
    if (!noResults) {
        noResults = document.createElement('p');
        noResults.id = 'no-results';
        noResults.style.color = '#fff';
        noResults.style.marginTop = '20px';
        noResults.textContent = "Nenhum jogo encontrado.";
        list.appendChild(noResults);
    }

    noResults.style.display = gamesToShow.length === 0 ? 'block' : 'none';
}

function renderPagination() {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const totalPages = Math.ceil(filteredGames.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = (i === currentPage) ? "active" : "";
        btn.addEventListener("click", () => {
            currentPage = i;
            renderGames();
            renderPagination();
        });
        pagination.appendChild(btn);
    }
}
