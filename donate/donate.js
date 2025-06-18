document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("doacao-list");

  const doacoes = [
    {
      imagemCard: "./images/card1.jpeg", // NEW: Image for the clickable card
      imagemPopup: "./images/qrcode10.jpeg", // Original: Image for the popup
      nome: "R$ 10,00",
      descricao: "Uma criança que você não tera nenhum trabalho para cuidar.",
      preco: 129.90,
      detalhes: "O Bebê Reborn é feito com silicone e roupas costuradas à mão. Ideal para presentes ou colecionadores.",
    },
    {
      imagemCard: "./images/card2.jpeg", // NEW: Image for the clickable card
      imagemPopup: "./images/qrcode25.jpeg", // Original: Image for the popup
      nome: "R$ 25,00",
      descricao: "Fraldas para o seu Bebê Reborn sempre ficar limpinho.",
      preco: 79.90,
      detalhes: "Contém 138 unidades. Conforto seco garantido por até 12h.",
    },
    {
      imagemCard: "./images/card3.jpeg", // NEW: Image for the clickable card
      imagemPopup: "./images/qrcode50.jpeg", // Original: Image for the popup
      nome: "R$ 50,00",
      descricao: "Sapatênis tamanho 38 para ficar muito no estilo.",
      preco: 90.00,
      detalhes: "Confeccionado em material sintético de alta qualidade, com palmilha macia e solado antiderrapante para máximo conforto e segurança.",
    },
    {
      imagemCard: "./images/card4.jpeg", // NEW: Image for the clickable card
      imagemPopup: "./images/qrcode75.jpeg", // Original: Image for the popup
      nome: "R$ 75,00",
      descricao: "Compre este boné do PT para estar sempre apoiando nosso querido presidente.",
      preco: 13.13,
      detalhes: "Boné ajustável com estampa bordada em destaque, feito em algodão resistente para garantir estilo e durabilidade no apoio ao seu partido.",
    },
    {
      imagemCard: "./images/card5.jpeg", // NEW: Image for the clickable card
      imagemPopup: "./images/qrcode100.jpeg", // Original: Image for the popup
      nome: "R$ 100,00",
      descricao: "Esse tapete impede de suas visitas chegarem na sua casa e falar mal da pipokinha.",
      preco: 69.00,
      detalhes: "Tapete em tecido antiderrapante, com estampa ousada e divertida da MC Pipokinha. Ideal para quem quer recepcionar as visitas com muito estilo (e um toque de polêmica).",
    }
  ];

  doacoes.forEach(doacao => {
    const card = document.createElement("div");
    card.className = "doacao-card";
    card.innerHTML = `
      <img src="${doacao.imagemCard}" alt="${doacao.nome}">
      <h2>${doacao.nome}</h2>
    `;

    card.addEventListener("click", () => {
      abrirPopup(doacao);
    });

    lista.appendChild(card);
  });

  function abrirPopup(doacao) {
    const popup = document.createElement("div");
    popup.className = "popup-overlay";
    popup.innerHTML = `
      <div class="popup-content">
        <span class="popup-close">&times;</span>
        <img src="${doacao.imagemPopup}" alt="${doacao.nome}">
        <h2>${doacao.nome}</h2>
      </div>
    `;

    document.body.appendChild(popup);

    popup.querySelector(".popup-close").addEventListener("click", () => {
      popup.remove();
    });

    popup.addEventListener("click", (event) => {
        if (event.target === popup) {
            popup.remove();
        }
    });
  }
});


const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('open');
  mobileMenu.classList.toggle('active');
});
