const itemsPerPage = 18;
let currentPage = 1;
let allGames = [];

document.addEventListener("DOMContentLoaded", () => {
    fetch('http://localhost:3000/games')
        .then(response => response.json())
        .then(data => {
            allGames = data;
            renderGames();
            renderPagination();
        })
        .catch(error => console.error("Erro ao carregar os jogos:", error));
});

function renderGames() {
    const list = document.getElementById('games-list');
    list.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const gamesToShow = allGames.slice(start, end);

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
}

function renderPagination() {
    const totalPages = Math.ceil(allGames.length / itemsPerPage);
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

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
