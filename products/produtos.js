document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("product-list");

  // Produtos
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
      detalhes: "Boné ajustável com estampa bordada em destaque, feito em algodão resistente para garantir estilo e durabilidade.",
    },
    {
      imagem: "./images/Produto5.jpeg",
      nome: "Tapete da MC Pipokinha",
      descricao: "Esse tapete impede de suas visitas chegarem na sua casa e falar mal da pipokinha.",
      preco: 69.00,
      detalhes: "Tapete em tecido antiderrapante, com estampa ousada e divertida da MC Pipokinha.",
    }
  ];

  // Renderizar produtos
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

  // Popup de detalhes do produto
  function abrirPopup(produto) {
    fecharPopups(); // garante que só um popup existe

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

    popup.querySelector(".popup-close").addEventListener("click", () => fecharPopups());

    popup.querySelector(".btn-endereco").addEventListener("click", () => {
      const quantidade = parseInt(popup.querySelector("#quantidade").value);
      if (quantidade > 0) {
        abrirFormularioFinalizar([{ ...produto, quantidade }]);
        fecharPopups();
      }
    });

    popup.querySelector(".btn-add-carrinho").addEventListener("click", () => {
      const quantidade = parseInt(popup.querySelector("#quantidade").value);
      if (quantidade > 0) {
        adicionarAoCarrinho(produto, quantidade);
        alert(`${produto.nome} foi adicionado ao seu carrinho!`);
        fecharPopups();
      }
    });
  }

  // Função para fechar qualquer popup existente
  function fecharPopups() {
    document.querySelectorAll(".popup-overlay").forEach(p => p.remove());
  }

  // Adicionar ao carrinho
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

  // Abrir carrinho
  function abrirCarrinho() {
    fecharPopups();
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

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
            <img src="${item.imagem}" alt="${item.nome}" style="width:60px; border-radius:6px; margin:5px;">
            <div style="flex:1; margin-left:10px;">
              <p><strong>${item.nome}</strong></p>
              <p>Preço unitário: R$ ${item.preco.toFixed(2)}</p>
            </div>
            <div class="carrinho-item-quantidade">
              <button class="diminuir" data-index="${index}">&lt;</button>
              <span class="quantidade">${item.quantidade}</span>
              <button class="aumentar" data-index="${index}">&gt;</button>
              <p>Total: R$ ${(item.preco * item.quantidade).toFixed(2)}</p>
            </div>
          </div>
          <hr>
        `;
      });

      conteudo += `<button class="btn-finalizar-carrinho">Finalizar Compra</button>`;
    }

    conteudo += `</div>`;
    popup.innerHTML = conteudo;
    document.body.appendChild(popup);

    popup.querySelector(".popup-close").addEventListener("click", () => fecharPopups());

    // Alterar quantidades
    popup.querySelectorAll(".diminuir, .aumentar").forEach(btn => {
      btn.addEventListener("click", e => {
        const index = parseInt(e.target.getAttribute("data-index"));
        let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
        let produto = carrinho[index];

        if (e.target.classList.contains("aumentar")) {
          produto.quantidade++;
        } else if (produto.quantidade > 1) {
          produto.quantidade--;
        }

        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        fecharPopups();
        abrirCarrinho(); // recarrega popup atualizado
      });
    });

    // Finalizar compra
    if (carrinho.length > 0) {
      popup.querySelector(".btn-finalizar-carrinho").addEventListener("click", () => {
        fecharPopups();
        abrirFormularioFinalizar(carrinho);
      });
    }
  }

  // Botões abrir carrinho
  document.getElementById("btn-carrinho-desktop").addEventListener("click", abrirCarrinho);
  document.getElementById("btn-carrinho-mobile").addEventListener("click", abrirCarrinho);
});

// Tela de finalizar compra
function abrirFormularioFinalizar(carrinho) {
  const popup = document.createElement("div");
  popup.className = "popup-overlay";

  let subtotal = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  let frete = 10.99;
  let total = (subtotal + frete).toFixed(2);

  const enderecoSalvo = JSON.parse(localStorage.getItem("endereco")) || {
    cep: "", cidade: "", estado: "", bairro: "", rua: "", numero: "", complemento: ""
  };

  let conteudo = `
    <div class="popup-content">
      <span class="popup-close">&times;</span>
      <h2>Finalizar Compra</h2>
  `;

  carrinho.forEach(item => {
    conteudo += `
      <div class="carrinho-item">
        <img src="${item.imagem}" alt="${item.nome}" style="width:60px; border-radius:6px; margin:5px;">
        <div style="flex:1; margin-left:10px;">
          <p><strong>${item.nome}</strong></p>
          <p>Preço unitário: R$ ${item.preco.toFixed(2)}</p>
          <p>Quantidade: ${item.quantidade}</p>
          <p>Total: R$ ${(item.preco * item.quantidade).toFixed(2)}</p>
        </div>
      </div>
      <hr>
    `;
  });

  conteudo += `
    <h3>Resumo do Pedido</h3>
    <p><strong>Sub-total:</strong> R$ ${subtotal.toFixed(2)}</p>
    <p><strong>Frete:</strong> R$ ${frete.toFixed(2)}</p>
    <p><strong>Total:</strong> R$ ${total}</p>

    <h3>Endereço de Entrega</h3>
    <form id="form-endereco">
      <input type="text" id="cep" placeholder="CEP (xxxxx-xxx)" value="${enderecoSalvo.cep}" maxlength="9" required><br>
      <input type="text" id="cidade" placeholder="Cidade" value="${enderecoSalvo.cidade}" required><br>
      <input type="text" id="estado" placeholder="Estado" value="${enderecoSalvo.estado}" required><br>
      <input type="text" id="bairro" placeholder="Bairro" value="${enderecoSalvo.bairro}" required><br>
      <input type="text" id="rua" placeholder="Rua" value="${enderecoSalvo.rua}" required><br>
      <input type="text" id="numero" placeholder="Número" value="${enderecoSalvo.numero}" required><br>
      <input type="text" id="complemento" placeholder="Complemento" value="${enderecoSalvo.complemento}">
    </form>

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

  popup.innerHTML = conteudo;
  document.body.appendChild(popup);

  popup.querySelector(".popup-close").addEventListener("click", () => popup.remove());

  /* ---------- validações de inputs ---------- */
  const cepInput = popup.querySelector("#cep");
  cepInput.addEventListener("input", () => {
    let value = cepInput.value.replace(/\D/g, ""); // remove não números
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 5) {
      cepInput.value = value.slice(0, 5) + "-" + value.slice(5);
    } else {
      cepInput.value = value;
    }
  });

  // função para deixar capitalizado
  function capitalizeWords(str) {
    return str.replace(/\b\w+/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  }

  ["#cidade", "#estado", "#bairro", "#rua"].forEach(id => {
    const input = popup.querySelector(id);
    input.addEventListener("input", () => {
      input.value = capitalizeWords(input.value);
    });
  });

  // apenas números no número
  const numeroInput = popup.querySelector("#numero");
  numeroInput.addEventListener("input", () => {
    numeroInput.value = numeroInput.value.replace(/\D/g, "");
  });

  /* ---------- finalizar pedido ---------- */
  popup.querySelector(".btn-finalizar-pedido").addEventListener("click", () => {
    const pagamento = popup.querySelector("#pagamento").value;
    const form = popup.querySelector("#form-endereco");

    const endereco = {
      cep: form.querySelector("#cep").value,
      cidade: form.querySelector("#cidade").value,
      estado: form.querySelector("#estado").value,
      bairro: form.querySelector("#bairro").value,
      rua: form.querySelector("#rua").value,
      numero: form.querySelector("#numero").value,
      complemento: form.querySelector("#complemento").value
    };

    // validação
    if (!/^\d{5}-\d{3}$/.test(endereco.cep)) {
      alert("CEP inválido. Use o formato xxxxx-xxx.");
      return;
    }
    if (!pagamento || !endereco.cidade || !endereco.estado || !endereco.bairro || !endereco.rua || !endereco.numero) {
      alert("Por favor, preencha todos os campos obrigatórios e selecione o método de pagamento.");
      return;
    }

    localStorage.setItem("endereco", JSON.stringify(endereco));

    alert(`Pedido finalizado!\nTotal: R$ ${total}\nPagamento: ${pagamento}\nEntrega em: ${endereco.rua}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade}-${endereco.estado}\nCEP: ${endereco.cep}`);

    popup.remove();
    localStorage.removeItem("carrinho");
  });
}
