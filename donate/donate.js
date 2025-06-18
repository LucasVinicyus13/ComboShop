document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("doacao-list");

  const doacoes = [
    {
      imagem: "./images/Produto1.jpeg",
      nome: "Bebê Reborn",
      descricao: "Uma criança que você não tera nenhum trabalho para cuidar.",
      preco: 129.90,
      detalhes: "O Bebê Reborn é feito com silicone e roupas costuradas à mão. Ideal para presentes ou colecionadores.",
    },
    {
      imagem: "./images/Produto2.jpg",
      nome: "Fraldas Pampers",
      descricao: "Fraldas para o seu Bebê Reborn sempre ficar limpinho.",
      preco: 79.90,
      detalhes: "Contém 138 unidades. Conforto seco garantido por até 12h.",
    },
    {
      imagem: "./images/Produto3.png",
      nome: "Sapatênis",
      descricao: "Sapatênis tamanho 38 para ficar muito no estilo.",
      preco: 90.00,
      detalhes: "Confeccionado em material sintético de alta qualidade, com palmilha macia e solado antiderrapante para máximo conforto e segurança.",
    },
    {
      imagem: "./images/Produto4.jpg",
      nome: "Boné do PT",
      descricao: "Compre este boné do PT para estar sempre apoiando nosso querido presidente.",
      preco: 13.13,
      detalhes: "Boné ajustável com estampa bordada em destaque, feito em algodão resistente para garantir estilo e durabilidade no apoio ao seu partido.",
    },
    {
      imagem: "./images/Produto5.jpeg",
      nome: "Tapete da MC Pipokinha",
      descricao: "Esse tapete impede de suas visitas chegarem na sua casa e falar mal da pipokinha.",
      preco: 69.00,
      detalhes: "Tapete em tecido antiderrapante, com estampa ousada e divertida da MC Pipokinha. Ideal para quem quer recepcionar as visitas com muito estilo (e um toque de polêmica).",
    }
  ];

  doacoes.forEach(doacao => {
    const card = document.createElement("div");
    card.className = "doacao-card";
    card.innerHTML = `
      <img src="${doacao.imagem}" alt="${doacao.nome}">
      <h2>${doacao.nome}</h2>
    `;

    lista.appendChild(card);
  });

  // Removed all functions related to purchasing (abrirPopup, abrirFormularioEndereco, abrirPopupEndereco)
  // as they are no longer accessible or needed for this simplified display.
});


const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('open');
  mobileMenu.classList.toggle('active');
});
