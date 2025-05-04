let itemsPerPage;
let currentPage = 1;
let allGames = [];
let filteredGames = [];
let currentUser = localStorage.getItem("currentUser") || null;
let favoritosIds = [];

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

    if (currentUser) {
        document.getElementById("welcome-user").innerText = `👋 Olá, ${currentUser}`;
        document.getElementById("show-favorites").style.display = "inline-block";
        document.getElementById("logout-btn").style.display = "inline-block";
        document.getElementById("auth-container").style.display = "none";
        loadFavoritos();
    }
});

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

        if (currentUser) {
            const isFavorito = favoritosIds.includes(game.id);
            const favButton = document.createElement('button');
            favButton.innerText = isFavorito ? "❌ Remover dos Favoritos" : "⭐ Favoritar";
            favButton.style.backgroundColor = isFavorito ? "#ff6666" : "#d19bff";
            favButton.onclick = () => {
                isFavorito ? desfavoritar(game.id) : favoritar(game.id);
            };
            div.appendChild(favButton);
        }

        list.appendChild(div);
    });

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

function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => {
        if (!res.ok) throw new Error("Login inválido");
        return res.json();
    })
    .then(data => {
        currentUser = data.username;
        localStorage.setItem("currentUser", currentUser);
        document.getElementById("auth-status").innerText = "Login efetuado!";
        document.getElementById("welcome-user").innerText = `👋 Olá, ${currentUser}`;
        document.getElementById("show-favorites").style.display = "inline-block";
        document.getElementById("logout-btn").style.display = "inline-block";
        document.getElementById("auth-container").style.display = "none";
        loadFavoritos();
        renderGames();
    })
    .catch(err => {
        document.getElementById("auth-status").innerText = "Erro: " + err.message;
    });
}

function register() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.text())
    .then(msg => {
        document.getElementById("auth-status").innerText = msg;
    })
    .catch(err => {
        document.getElementById("auth-status").innerText = "Erro: " + err.message;
    });
}

function logout() {
    localStorage.removeItem("currentUser");
    currentUser = null;
    favoritosIds = [];
    document.getElementById("welcome-user").innerText = "";
    document.getElementById("show-favorites").style.display = "none";
    document.getElementById("logout-btn").style.display = "none";
    document.getElementById("auth-container").style.display = "flex";
    document.getElementById("back-home").style.display = "none";
    filteredGames = allGames;
    renderGames();
    renderPagination();
}

function favoritar(jogoId) {
    fetch("http://localhost:3000/favoritar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: currentUser, jogoId })
    })
    .then(res => res.text())
    .then(msg => {
        favoritosIds.push(jogoId);
        renderGames();
    })
    .catch(err => alert("Erro: " + err.message));
}

function desfavoritar(jogoId) {
    fetch("http://localhost:3000/desfavoritar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: currentUser, jogoId })
    })
    .then(res => res.text())
    .then(msg => {
        favoritosIds = favoritosIds.filter(id => id !== jogoId);
        renderGames();
    })
    .catch(err => alert("Erro: " + err.message));
}

function showFavorites() {
    if (!currentUser) return;

    fetch(`http://localhost:3000/favoritos/${currentUser}`)
        .then(res => res.json())
        .then(data => {
            filteredGames = data;
            favoritosIds = data.map(j => j.id);
            currentPage = 1;
            renderGames();
            renderPagination();
            document.getElementById("back-home").style.display = "inline-block";
        })
        .catch(err => alert("Erro ao carregar favoritos: " + err.message));
}

function goHome() {
    filteredGames = allGames;
    currentPage = 1;
    loadFavoritos();
    renderGames();
    renderPagination();
    document.getElementById("back-home").style.display = "none";
}

function loadFavoritos() {
    if (!currentUser) return;
    fetch(`http://localhost:3000/favoritos/${currentUser}`)
        .then(res => res.json())
        .then(data => {
            favoritosIds = data.map(j => j.id);
        });
}
