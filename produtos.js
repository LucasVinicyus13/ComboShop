document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("product-list");

  // Lista de produtos
  const produtos = [
    {
      imagem: "./images/Produto1.jpeg",
      nome: "Bebê Reborn",
      descricao: "Uma criança que você não tera nenhum trabalho para cuidar.",
      preco: "R$ 129,90",
      detalhes: "O Bebê Reborn é feito com silicone e roupas costuradas à mão. Ideal para presentes ou colecionadores.",
    },
    {
      imagem: "./images/Produto2.jpg",
      nome: "Fraldas Pampers",
      descricao: "Fraldas para o seu Bebê Reborn sempre ficar limpinho.",
      preco: "R$ 79,90",
      detalhes: "Contém 138 unidades. Conforto seco garantido por até 12h.",
    },
    {
      imagem: "./images/Produto3.png",
      nome: "Sapatênis",
      descricao: "Sapatênis tamanho 38 para ficar muito no estilo.",
      preco: "R$ 90,00",
      detalhes: "Confeccionado em material sintético de alta qualidade, com palmilha macia e solado antiderrapante para máximo conforto e segurança.",
    },
    {
      imagem: "./images/Produto4.jpg",
      nome: "Boné do PT",
      descricao: "Compre este boné do PT para estar sempre apoiando nosso querido presidente.",
      preco: "R$ 13,13",
      detalhes: "Boné ajustável com estampa bordada em destaque, feito em algodão resistente para garantir estilo e durabilidade no apoio ao seu partido.",
    },
    {
      imagem: "./images/Produto5.jpeg",
      nome: "Tapete da MC Pipokinha",
      descricao: "Esse tapete impede de suas visitas chegarem na sua casa e falar mal da pipokinha.",
      preco: "R$ 69,00",
      detalhes: "Tapete em tecido antiderrapante, com estampa ousada e divertida da MC Pipokinha. Ideal para quem quer recepcionar as visitas com muito estilo (e um toque de polêmica).",
    }
  ];

  // Criação dos cards
  produtos.forEach(produto => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
  <img src="${produto.imagem}" alt="${produto.nome}">
  <h2>${produto.nome}</h2>
  <p>${produto.descricao}</p>
  <span class="price">${produto.preco}</span>
  <button type="button" class="btn-comprar">Comprar</button>
`;

    const button = card.querySelector(".btn-comprar");
    button.addEventListener("click", () => {
      abrirPopup(produto);
    });

    lista.appendChild(card);
  });

  // Função do pop-up
  function abrirPopup(produto) {
    const popup = document.createElement("div");
    popup.className = "popup-overlay";
    popup.innerHTML = `
  <div class="popup-content">
    <span class="popup-close">&times;</span>
    <img src="${produto.imagem}" alt="${produto.nome}">
    <h2>${produto.nome}</h2>
    <p>${produto.descricao}</p>
    <p><strong>Mais detalhes:</strong> ${produto.detalhes}</p>
    <span class="price">${produto.preco}</span>
    <button type="button" class="btn-popup-comprar">Comprar</button>
  </div>
`;


    document.body.appendChild(popup);

    // Fechar pop-up
    popup.querySelector(".popup-close").addEventListener("click", () => {
      popup.remove();
    });

    // Comprar dentro do pop-up
    popup.querySelector(".btn-popup-comprar").addEventListener("click", () => {
      alert(`Você comprou: ${produto.nome}`);
      popup.remove();
    });
  }
});
