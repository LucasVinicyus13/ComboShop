document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("product-list");

  const produtos = [
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

  produtos.forEach(produto => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      <h2>${produto.nome}</h2>
      <p>${produto.descricao}</p>
      <span class="price">R$ ${produto.preco.toFixed(2)}</span>
      <button type="button" class="btn-comprar">Comprar</button>
    `;

    card.querySelector(".btn-comprar").addEventListener("click", () => {
      abrirPopup(produto);
    });

    lista.appendChild(card);
  });

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
        <label for="quantidade">Quantidade:</label>
        <input type="number" id="quantidade" min="1" value="1" required>
        <span class="price">R$ ${produto.preco.toFixed(2)}</span>
        <button type="button" class="btn-endereco">Comprar</button>
        <button type="button" class="btn-add-carrinho">Adicionar ao Carrinho</button>
      </div>
    `;

    document.body.appendChild(popup);

    popup.querySelector(".popup-close").addEventListener("click", () => {
      popup.remove();
    });

    popup.querySelector(".btn-endereco").addEventListener("click", () => {
      const quantidade = parseInt(popup.querySelector("#quantidade").value);
      if (quantidade <= 0 || isNaN(quantidade)) {
        alert("Por favor, insira uma quantidade válida.");
        return;
      }
      abrirFormularioEndereco(produto, quantidade);
      popup.remove();
    });

    popup.querySelector(".btn-add-carrinho").addEventListener("click", () => {
      const quantidade = parseInt(popup.querySelector("#quantidade").value);
      if (quantidade <= 0 || isNaN(quantidade)) {
        alert("Por favor, insira uma quantidade válida.");
        return;
      }
      adicionarAoCarrinho(produto, quantidade);
      alert(`${produto.nome} foi adicionado ao seu carrinho!`);
      popup.remove();
    });
  }

  function adicionarAoCarrinho(produto, quantidade) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    const itemExistente = carrinho.find(item => item.nome === produto.nome);

    if (itemExistente) {
      itemExistente.quantidade += quantidade;
    } else {
      carrinho.push({
        nome: produto.nome,
        imagem: produto.imagem,
        preco: produto.preco,
        quantidade: quantidade
      });
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }

  // Carrinho
  function abrirCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  const popup = document.createElement("div");
  popup.className = "popup-overlay";

  let conteudo = `
    <div class="popup-content">
      <span class="popup-close">&times;</span>
      <h2>Meu Carrinho</h2>
  `;

  if (carrinho.length === 0) {
    conteudo += `<p>Você ainda não adicionou nenhum item ao seu carrinho.</p>`;
  } else {
    carrinho.forEach((item, index) => {
      conteudo += `
        <div class="carrinho-item">
          <div class="carrinho-item-info">
            <img src="${item.imagem}" alt="${item.nome}" class="carrinho-item-img">
            <div class="carrinho-item-details">
              <p class="carrinho-item-nome"><strong>${item.nome}</strong></p>
              <p class="carrinho-item-preco">R$ ${item.preco.toFixed(2)}</p>
              <div class="carrinho-item-quantidade">
                <button class="btn-quantidade diminuir" data-index="${index}">←</button>
                <span class="quantidade">${item.quantidade}</span>
                <button class="btn-quantidade aumentar" data-index="${index}">→</button>
              </div>
              <p class="carrinho-item-total">Total: R$ ${(
                item.preco * item.quantidade
              ).toFixed(2)}</p>
            </div>
          </div>
        </div>
        <hr>
      `;
    });
  }

  conteudo += `</div>`;
  popup.innerHTML = conteudo;

  document.body.appendChild(popup);

  // Fechar popup
  popup.querySelector(".popup-close").addEventListener("click", () => {
    popup.remove();
  });

  // Atualizar carrinho (aumentar ou diminuir a quantidade)
  popup.querySelectorAll(".btn-quantidade").forEach(button => {
    button.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
      let produto = carrinho[index];
      
      // Aumentar ou diminuir quantidade
      if (e.target.classList.contains("aumentar")) {
        produto.quantidade++;
      } else if (e.target.classList.contains("diminuir") && produto.quantidade > 1) {
        produto.quantidade--;
      }

      // Atualiza o carrinho no localStorage
      localStorage.setItem("carrinho", JSON.stringify(carrinho));

      // Atualiza a interface (quantidade e total)
      popup.querySelectorAll(".quantidade")[index].textContent = produto.quantidade;
      popup.querySelectorAll(".carrinho-item-total")[index].textContent = `Total: R$ ${(
        produto.preco * produto.quantidade
      ).toFixed(2)}`;
    });
  });
}

  // Botões do carrinho
  document.getElementById("btn-carrinho-desktop").addEventListener("click", abrirCarrinho);
  document.getElementById("btn-carrinho-mobile").addEventListener("click", abrirCarrinho);
});
