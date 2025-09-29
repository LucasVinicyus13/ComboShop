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
      nome: "Peruca Loira",
      descricao: "Para você ficar divo que nem o Ken da Barbie.",
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

  /* ---------- renderizar produtos ---------- */
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

  /* ---------- popup do produto (comprar / adicionar ao carrinho) ---------- */
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

    popup.querySelector(".popup-close").addEventListener("click", () => popup.remove());

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

  /* ---------- adicionar ao carrinho (localStorage) ---------- */
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

  /* ---------- abrir carrinho (renderiza popup com itens e botões) ---------- */
  function abrirCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    // remove popup existente (segurança)
    document.querySelectorAll(".popup-overlay").forEach(el => el.remove());

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
          <div class="carrinho-item" data-index="${index}">
            <div class="carrinho-item-info" style="display:flex; align-items:center;">
              <img src="${item.imagem}" alt="${item.nome}" class="carrinho-item-img" style="width:60px; border-radius:6px; margin-right:10px;">
              <div class="carrinho-item-details" style="flex:1;">
                <p><strong>${item.nome}</strong></p>
                <p>Preço unitário: R$ ${item.preco.toFixed(2)}</p>
              </div>
            </div>

            <div class="carrinho-item-quantidade-total" style="display:flex; flex-direction:column; align-items:flex-end;">
              <div class="carrinho-item-quantidade" style="display:flex; align-items:center; gap:8px;">
                <button class="btn-dim" data-index="${index}">&lt;</button>
                <span class="quantidade" data-index="${index}">${item.quantidade}</span>
                <button class="btn-aum" data-index="${index}">&gt;</button>
              </div>
              <p class="carrinho-item-total" data-index="${index}">Total: R$ ${(item.preco * item.quantidade).toFixed(2)}</p>
            </div>
          </div>
          <hr>
        `;
      });

      conteudo += `
        <div style="display:flex; justify-content:center; margin-top:10px;">
          <button class="btn-finalizar-carrinho">Finalizar Compra</button>
        </div>
      `;
    }

    conteudo += `</div>`; // fecha popup-content
    popup.innerHTML = conteudo;
    document.body.appendChild(popup);

    // fechar
    popup.querySelector(".popup-close").addEventListener("click", () => popup.remove());

    // listeners para aumentar/diminuir (re-renderiza o popup depois de atualizar)
    popup.querySelectorAll(".btn-dim").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.index, 10);
        alterarQuantidade(idx, -1);
      });
    });
    popup.querySelectorAll(".btn-aum").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.index, 10);
        alterarQuantidade(idx, 1);
      });
    });

    // finalizar compra
    if (carrinho.length > 0) {
      popup.querySelector(".btn-finalizar-carrinho").addEventListener("click", () => {
        popup.remove();
        abrirFormularioFinalizar(carrinho);
      });
    }
  }

  /* ---------- funções de endereço / finalizar (mantive a lógica que você já tinha) ---------- */
  function abrirFormularioEndereco(produto, quantidade) {
    const popup = document.createElement("div");
    popup.className = "popup-overlay";

    const totalProduto = (produto.preco * quantidade).toFixed(2);
    const totalPedido = (produto.preco * quantidade + 10.99).toFixed(2);

    popup.innerHTML = `
      <div class="popup-content">
        <span class="popup-close">&times;</span>
        <h2>Finalizar Compra</h2>
        <p><strong>Produto:</strong> ${produto.nome}</p>
        <p><strong>Quantidade:</strong> ${quantidade}</p>
        <p><strong>Total (Produto):</strong> R$ ${totalProduto}</p>
        <p><strong>Frete:</strong> R$ 10.99</p>
        <p><strong>Total do Pedido:</strong> R$ ${totalPedido}</p>

        <button type="button" class="btn-endereco">Endereço de Entrega</button> <br> <br>

        <h3>Método de Pagamento:</h3>
        <select id="pagamento" required>
          <option value="">Selecione</option>
          <option value="Cartão de Crédito">Cartão de Crédito</option>
          <option value="Pix">Pix</option>
          <option value="Boleto">Boleto</option>
        </select>

        <button type="button" class="btn-finalizar-pedido">Finalizar Pedido</button>
      </div>
    `;

    document.body.appendChild(popup);

    const endereco = {
      cep: '', cidade: '', estado: '', bairro: '', rua: '', numero: '', complemento: ''
    };

    const enderecoSalvo = JSON.parse(localStorage.getItem("enderecoSalvo"));
    if (enderecoSalvo) {
      Object.assign(endereco, enderecoSalvo);
    }

    popup.querySelector(".popup-close").addEventListener("click", () => popup.remove());

    popup.querySelector(".btn-endereco").addEventListener("click", () => {
      abrirPopupEndereco(endereco);
    });

    popup.querySelector(".btn-finalizar-pedido").addEventListener("click", () => {
      const pagamento = popup.querySelector('#pagamento').value;

      if (!pagamento) {
        alert("Por favor, selecione o método de pagamento
