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

  // Novo: adicionar ao carrinho
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


    popup.querySelector(".btn-endereco").addEventListener("click", () => {
      const quantidade = parseInt(popup.querySelector("#quantidade").value);
      if (quantidade <= 0 || isNaN(quantidade)) {
        alert("Por favor, insira uma quantidade válida.");
        return;
      }
      abrirFormularioEndereco(produto, quantidade);
      popup.remove();
    });
  }

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
        alert("Por favor, selecione o método de pagamento.");
        return;
      }

      if (!endereco.cep || !endereco.numero || !endereco.cidade || !endereco.estado || !endereco.bairro || !endereco.rua) {
        alert("Por favor, preencha o endereço de entrega antes de finalizar.");
        return;
      }

      const total = (produto.preco * quantidade + 10.99).toFixed(2);

      alert(`
Pedido Finalizado!

Produto: ${produto.nome}
Quantidade: ${quantidade}
Total: R$ ${total}

Endereço de Entrega:
CEP: ${endereco.cep}
Cidade: ${endereco.cidade}
Estado: ${endereco.estado}
Bairro: ${endereco.bairro}
Rua: ${endereco.rua}, Nº ${endereco.numero}
Complemento: ${endereco.complemento || "N/A"}

Método de Pagamento: ${pagamento}

Obrigado pela compra!
      `);
      popup.remove();
    });
  }

  function abrirPopupEndereco(endereco) {
    const popup = document.createElement("div");
    popup.className = "popup-overlay";
    popup.innerHTML = `
      <div class="popup-content">
        <span class="popup-close">&times;</span>
        <h2>Endereço de Entrega</h2>

        <label>CEP:</label>
        <input type="text" id="cep" placeholder="00000-000" maxlength="9" required>

        <label>Cidade:</label>
        <input type="text" id="cidade" required>

        <label>Estado (UF):</label>
        <input type="text" id="estado" maxlength="2" required>

        <label>Bairro:</label>
        <input type="text" id="bairro" required>

        <label>Rua:</label>
        <input type="text" id="rua" required>

        <label>Número:</label>
        <input type="text" id="numero" required>

        <label>Complemento (opcional):</label>
        <input type="text" id="complemento">

        <button type="button" id="salvar-endereco">Salvar Endereço</button>
      </div>
    `;
    document.body.appendChild(popup);

    const cepInput = popup.querySelector('#cep');
    const cidadeInput = popup.querySelector('#cidade');
    const estadoInput = popup.querySelector('#estado');
    const numeroInput = popup.querySelector('#numero');

    if (endereco.cep) cepInput.value = endereco.cep;
    if (endereco.cidade) cidadeInput.value = endereco.cidade;
    if (endereco.estado) estadoInput.value = endereco.estado;
    if (endereco.bairro) popup.querySelector('#bairro').value = endereco.bairro;
    if (endereco.rua) popup.querySelector('#rua').value = endereco.rua;
    if (endereco.numero) numeroInput.value = endereco.numero;
    if (endereco.complemento) popup.querySelector('#complemento').value = endereco.complemento;

    cepInput.addEventListener('input', () => {
      let valor = cepInput.value.replace(/\D/g, '');
      if (valor.length > 5) {
        valor = valor.slice(0, 5) + '-' + valor.slice(5, 8);
      }
      cepInput.value = valor;
    });

    estadoInput.addEventListener('input', () => {
      estadoInput.value = estadoInput.value.toUpperCase();
    });

    cidadeInput.addEventListener('blur', () => {
      cidadeInput.value = cidadeInput.value
        .toLowerCase()
        .split(' ')
        .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
        .join(' ');
    });

    numeroInput.addEventListener('input', () => {
      numeroInput.value = numeroInput.value.replace(/\D/g, '');
    });

    popup.querySelector(".popup-close").addEventListener("click", () => popup.remove());

    popup.querySelector("#salvar-endereco").addEventListener("click", () => {
      const cep = cepInput.value;
      const cidade = cidadeInput.value.trim();
      const estado = estadoInput.value.trim();
      const bairro = popup.querySelector('#bairro').value.trim();
      const rua = popup.querySelector('#rua').value.trim();
      const numero = numeroInput.value.trim();
      const complemento = popup.querySelector('#complemento').value.trim();

      if (!cep || !cidade || !estado || !bairro || !rua || !numero) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
      }

      endereco.cep = cep;
      endereco.cidade = cidade;
      endereco.estado = estado;
      endereco.bairro = bairro;
      endereco.rua = rua;
      endereco.numero = numero;
      endereco.complemento = complemento;

      localStorage.setItem("enderecoSalvo", JSON.stringify(endereco));

      alert("Endereço salvo com sucesso!");
      popup.remove();
    });
  }
});


const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('open');
  mobileMenu.classList.toggle('active');
});

// Função para abrir o carrinho
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
    carrinho.forEach(item => {
      conteudo += `
        <div class="carrinho-item">
          <img src="${item.imagem}" alt="${item.nome}" style="width:60px; border-radius:6px; margin:5px 0;">
          <p><strong>${item.nome}</strong></p>
          <p>Preço unitário: R$ ${item.preco.toFixed(2)}</p>
          <p>Quantidade: ${item.quantidade}</p>
        </div>
        <hr>
      `;
    });
  }

  conteudo += `</div>`;
  popup.innerHTML = conteudo;

  document.body.appendChild(popup);

  popup.querySelector(".popup-close").addEventListener("click", () => {
    popup.remove();
  });
}


// Botões do carrinho
document.getElementById("btn-carrinho-desktop").addEventListener("click", abrirCarrinho);
document.getElementById("btn-carrinho-mobile").addEventListener("click", abrirCarrinho);

function adicionarAoCarrinho(produto, quantidade) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  // Verifica se o produto já existe no carrinho
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

