document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("donate-list");

  const doacoes = [
    {
      imagem: "./images/qrcode10.jpeg",
      nome: "R$10,00",
    },
    {
      imagem: "./images/qrcode25.jpeg",
      nome: "R$25,00",
    },
    {
      imagem: "./images/qrcode50.jpeg",
      nome: "R$50,00",
    },
    {
      imagem: "./images/qrcode75.jpeg",
      nome: "R$75,00",
    },
    {
      imagem: "./images/qrcode100.jpeg",
      nome: "R$100,00",
    }
  ];

  doacoes.forEach(doacoes => {
    const card = document.createElement("div");
    card.className = "donate-card";
    card.innerHTML = `
      <img src="${doacoes.imagem}" alt="${doacoes.nome}">
      <h2>${doacoes.nome}</h2>
    `;

    card.querySelector(".btn-comprar").addEventListener("click", () => {
      abrirPopup(doacoes);
    });

    lista.appendChild(card);
  });

  function abrirPopup(doacoes) {
    const popup = document.createElement("div");
    popup.className = "popup-overlay";
    popup.innerHTML = `
      <div class="popup-content">
        <span class="popup-close">&times;</span>
        <img src="${doacoes.imagem}" alt="${doacoes.nome}">
        <h2>${doacoes.nome}</h2>
        <p>${doacoes.descricao}</p>
        <p><strong>Mais detalhes:</strong> ${doacoes.detalhes}</p>
        <label for="quantidade">Quantidade:</label>
        <input type="number" id="quantidade" min="1" value="1" required>
        <span class="price">R$ ${doacoes.preco.toFixed(2)}</span>
        <button type="button" class="btn-endereco">Comprar</button>
      </div>
    `;

    document.body.appendChild(popup);

    popup.querySelector(".popup-close").addEventListener("click", () => {
      popup.remove();
    });

   
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('open');
  mobileMenu.classList.toggle('active');
});
