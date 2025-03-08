document.addEventListener("DOMContentLoaded", () => {
    fetch('http://localhost:3000/games')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('games-list');
            list.innerHTML = ""; // Limpa a lista antes de carregar

            data.forEach(game => {
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
        })
        .catch(error => console.error("Erro ao carregar os jogos:", error));
});

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search"); // Certifique-se de que o campo de busca tem este ID

    searchInput.addEventListener("input", function () {
        const filterValue = searchInput.value.trim().toLowerCase();
        const gameCards = document.querySelectorAll(".game");

        gameCards.forEach(card => {
            const title = card.querySelector(".game-title").textContent.toLowerCase();
            const genre = card.querySelector(".game-genre").textContent.toLowerCase();
            const year = card.querySelector(".game-year").textContent.toLowerCase();

            // Busca exata para evitar conflitos como "ação" e "simulação"
            const genreWords = genre.split(/\s+/); // Divide os gêneros por espaços
            const isExactMatch = genreWords.some(word => word === filterValue);

            if (title.includes(filterValue) || isExactMatch || year.includes(filterValue)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
});
