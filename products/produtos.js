// FUNÇÃO: Mostrar popup de alerta customizado
function mostrarPopupAlerta(mensagem, tipo = "info") {
  const popup = document.createElement("div")
  popup.className = "popup-alerta-overlay"

  const cores = {
    success: "#4CAF50",
    warning: "#ff9800",
    error: "#f44336",
    info: "#2196F3",
  }

  const icones = {
    success: "✓",
    warning: "⚠",
    error: "✕",
    info: "ℹ",
  }

  const cor = cores[tipo] || cores.info
  const icone = icones[tipo] || icones.info

  popup.innerHTML = `
    <div class="popup-alerta-content" style="border-left: 4px solid ${cor};">
      <div class="popup-alerta-header" style="background-color: ${cor};">
        <span class="popup-alerta-icone">${icone}</span>
      </div>
      <div class="popup-alerta-body" style="background-color: ${cor};">
        <p>${mensagem}</p>
      </div>
      <button class="popup-alerta-close" style="background-color: ${cor};">OK</button>
    </div>
  `

  document.body.appendChild(popup)

  // Fechar ao clicar no botão
  popup.querySelector(".popup-alerta-close").addEventListener("click", () => {
    popup.remove()
  })

  // Auto-close após 4 segundos
  setTimeout(() => {
    if (popup.parentElement) {
      popup.remove()
    }
  }, 4000)
}

// FUNÇÃO: Atualiza o contador do carrinho (movida para escopo global)
function atualizarContadorCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || []
  const totalItens = carrinho.length

  const desktopCounter = document.getElementById("contador-desktop")
  const mobileCounter = document.getElementById("contador-mobile")

  if (desktopCounter) desktopCounter.textContent = totalItens
  if (mobileCounter) mobileCounter.textContent = totalItens
}

document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("product-list")

  // Produtos
  const produtos = [
    {
      imagem: "./images/Produto1.jpeg",
      nome: "Bebê Reborn",
      descricao: "Uma criança que você não tera nenhum trabalho para cuidar.",
      preco: 129.9,
      detalhes: "O Bebê Reborn é feito com silicone e roupas costuradas à mão. Ideal para presentes ou colecionadores.",
    },
    {
      imagem: "./images/Produto2.jpg",
      nome: "Fraldas Pampers",
      descricao: "Fraldas para o seu Bebê Reborn sempre ficar limpinho.",
      preco: 79.9,
      detalhes: "Contém 138 unidades. Conforto seco garantido por até 12h.",
    },
    {
      imagem: "./images/Produto3.png",
      nome: "Sapatênis",
      descricao: "Sapatênis tamanho 38 para ficar muito no estilo.",
      preco: 90.0,
      detalhes:
        "Confeccionado em material sintético de alta qualidade, com palmilha macia e solado antiderrapante para máximo conforto e segurança.",
    },
    {
      imagem: "./images/Produto4.jpg",
      nome: "Peruca Loira",
      descricao: "Para você ficar divo que nem o Ken da Barbie.",
      preco: 13.13,
      detalhes:
        "Boné ajustável com estampa bordada em destaque, feito em algodão resistente para garantir estilo e durabilidade.",
    },
    {
      imagem: "./images/Produto5.jpeg",
      nome: "Tapete da MC Pipokinha",
      descricao: "Esse tapete impede de suas visitas chegarem na sua casa e falar mal da pipokinha.",
      preco: 69.0,
      detalhes: "Tapete em tecido antiderrapante, com estampa ousada e divertida da MC Pipokinha.",
    },
    {
      imagem: "./images/Produto6.jpeg",
      nome: "Óculos de Sol Falsificado",
      descricao: "Óculos de sol que não protege de nada, mas você vai parecer o Brad Pitt (ou pelo menos tentar).",
      preco: 15.9,
      detalhes: "Armação em plástico preto com lentes escuras decorativas (sem proteção UV). Design aviador clássico com estojo sintético incluído e adesivo 'Ray-Bam' na lente.",
    },
    {
      imagem: "./images/Produto7.jpeg",
      nome: "Chinelo Havaianas Premium Gold Edition",
      descricao: "É um chinelo. Mas é DOURADO. Agora você pode ir na padaria com estilo de milionário.",
      preco: 299.9,
      detalhes: "Solado em borracha brasileira com tiras pintadas em spray dourado metálico. Palmilha anatômica com glitter, tamanhos 33 ao 44, resistente à água.",
    },
    {
      imagem: "./images/Produto8.jpeg",
      nome: "Ventilador Manual Retrô",
      descricao: "Para quando acabar a energia e você perceber que depende demais da tecnologia. Inclui exercício para o braço de graça!",
      preco: 8.5,
      detalhes: "Leque dobrável em papel resistente com cabo de madeira envernizada. Estampa floral vintage, 23cm de altura, leve e portátil.",
    },
    {
      imagem: "./images/Produto9.jpeg",
      nome: "Caneca 'Não Fale Comigo Antes do Café'",
      descricao: "Aviso legal para seus colegas de trabalho. Não nos responsabilizamos por brigas matinais sem esta caneca.",
      preco: 25.0,
      detalhes: "Cerâmica branca de 325ml com frase em preto e alça ergonômica. Pode ir no microondas e lava-louças, ilustração de carinha brava no verso.",
    },
    {
      imagem: "./images/Produto10.jpeg",
      nome: "Almofada Peidorrenta Profissional",
      descricao: "Para aquele tio chato do churrasco ou para zoar seus amigos. Diversão garantida desde 1950. Testado e aprovado por crianças de todas as idades.",
      preco: 12.9,
      detalhes: "Almofada inflável em borracha bege com sistema de som realista. 30cm de diâmetro, fácil de inflar, testada em 15 países, banida em 3.",
    },
  ]

  // Chama a função ao carregar a página pela primeira vez
  atualizarContadorCarrinho()

  // Renderizar produtos
  produtos.forEach((produto) => {
    const card = document.createElement("div")
    card.className = "product-card"
    card.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <h2>${produto.nome}</h2>
            <p>${produto.descricao}</p>
            <span class="price">R$ ${produto.preco.toFixed(2)}</span>
            <button type="button" class="btn-comprar"><img src="images/setec.png" class="btn-img" alt="logo da setec">Comprar</button>
        `

    card.querySelector(".btn-comprar").addEventListener("click", () => {
      abrirPopup(produto)
    })

    lista.appendChild(card)
  })

  // Popup de detalhes do produto
  function abrirPopup(produto) {
    fecharPopups()

    const popup = document.createElement("div")
    popup.className = "popup-overlay"
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
                <button type="button" class="btn-endereco"><img src="./">Comprar</button>
                <button type="button" class="btn-add-carrinho">Adicionar ao Carrinho</button>
            </div>
        `

    document.body.appendChild(popup)

    popup.querySelector(".popup-close").addEventListener("click", () => fecharPopups())

    popup.querySelector(".btn-endereco").addEventListener("click", () => {
      const quantidade = Number.parseInt(popup.querySelector("#quantidade").value)

      if (quantidade > 0) {
        abrirFormularioFinalizar([{ ...produto, quantidade }], null, null)
        fecharPopups()
      }
    })

    popup.querySelector(".btn-add-carrinho").addEventListener("click", () => {
      const quantidade = Number.parseInt(popup.querySelector("#quantidade").value)
      if (quantidade > 0) {
        adicionarAoCarrinho(produto, quantidade)
        mostrarPopupAlerta(`${produto.nome} foi adicionado ao seu carrinho!`, "success")
        fecharPopups()
      }
    })
  }

  // Adicionar ao carrinho
  function adicionarAoCarrinho(produto, quantidade) {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || []
    const itemExistente = carrinho.find((item) => item.nome === produto.nome)

    if (itemExistente) {
      itemExistente.quantidade += quantidade
    } else {
      carrinho.push({
        nome: produto.nome,
        imagem: produto.imagem,
        preco: produto.preco,
        quantidade: quantidade,
      })
    }
    localStorage.setItem("carrinho", JSON.stringify(carrinho))
    atualizarContadorCarrinho()
  }

  // Abrir carrinho
  function abrirCarrinho() {
    fecharPopups()
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || []

    const popup = document.createElement("div")
    popup.className = "popup-overlay"

    let conteudo = `
            <div class="popup-content">
                <span class="popup-close">&times;</span>
                <h2>Meu Carrinho</h2>
        `

    if (carrinho.length === 0) {
      conteudo += `<p>Você ainda não adicionou nenhum item ao seu carrinho.</p>`
    } else {
      conteudo += `<p style="text-align: left; font-style: italic;">Selecione os itens que deseja comprar:</p>`

      carrinho.forEach((item, index) => {
        conteudo += `
                    <div class="carrinho-item">
                        <input type="checkbox" class="item-selecionado" data-index="${index}" checked>
                        <img src="${item.imagem}" alt="${item.nome}" style="width:60px; border-radius:6px; margin:5px;">
                        <div style="flex:1; margin-left:10px;">
                            <p><strong>${item.nome}</strong></p>
                            <p>Preço unitário: R$ ${item.preco.toFixed(2)}</p>
                        </div>
                        <div class="carrinho-item-quantidade">
                            <button class="diminuir" data-index="${index}" type="button">&lt;</button>
                            <span class="quantidade">${item.quantidade}</span>
                            <button class="aumentar" data-index="${index}" type="button">&gt;</button>
                            <p>Total: R$ ${(item.preco * item.quantidade).toFixed(2)}</p>
                        </div>
                    </div>
                    <hr>
                `
      })

      conteudo += `
                <button class="btn-finalizar-carrinho" type="button">Finalizar Compra (${carrinho.length} itens)</button>
            `
    }

    conteudo += `</div>`
    popup.innerHTML = conteudo
    document.body.appendChild(popup)

    popup.querySelector(".popup-close").addEventListener("click", () => fecharPopups())

    popup.querySelectorAll(".item-selecionado").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const itensSelecionados = popup.querySelectorAll(".item-selecionado:checked").length
        const btnFinalizar = popup.querySelector(".btn-finalizar-carrinho")
        btnFinalizar.textContent = `Finalizar Compra (${itensSelecionados} itens)`
        btnFinalizar.disabled = itensSelecionados === 0
      })
    })

    popup.querySelectorAll(".diminuir, .aumentar").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = Number.parseInt(e.target.getAttribute("data-index"))
        const carrinho = JSON.parse(localStorage.getItem("carrinho")) || []
        const produto = carrinho[index]

        if (e.target.classList.contains("aumentar")) {
          produto.quantidade++
        } else if (produto.quantidade > 1) {
          produto.quantidade--
        }

        if (produto.quantidade === 0) {
          carrinho.splice(index, 1)
        }

        localStorage.setItem("carrinho", JSON.stringify(carrinho))
        atualizarContadorCarrinho()
        fecharPopups()
        abrirCarrinho()
      })
    })

    if (carrinho.length > 0) {
      popup.querySelector(".btn-finalizar-carrinho").addEventListener("click", () => {
        const checkBoxes = popup.querySelectorAll(".item-selecionado")
        const itensParaComprar = []
        const itensRestantes = []

        checkBoxes.forEach((checkbox, index) => {
          if (checkbox.checked) {
            itensParaComprar.push(carrinho[index])
          } else {
            itensRestantes.push(carrinho[index])
          }
        })

        if (itensParaComprar.length === 0) {
          mostrarPopupAlerta("Você deve marcar pelo menos um item para prosseguir.", "warning")
          return
        }

        fecharPopups()
        abrirFormularioFinalizar(itensParaComprar, itensRestantes, null)
      })
    }
  }

  // Botões abrir carrinho
  document.getElementById("btn-carrinho-desktop").addEventListener("click", abrirCarrinho)
  document.getElementById("btn-carrinho-mobile").addEventListener("click", abrirCarrinho)

  /* FUNÇÕES AUXILIARES */
  window.capitalizeWords = (str) => str.replace(/\b\w+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
})

// Função para fechar qualquer popup existente (movida para escopo global)
function fecharPopups() {
  document.querySelectorAll(".popup-overlay").forEach((p) => p.remove())
}

/* ======================================= */
/* TELA DE ENDEREÇO */
/* ======================================= */
function abrirFormularioEndereco(carrinho, subtotal, frete, total, itensRestantes, cupomAplicado) {
  fecharPopups()

  const popup = document.createElement("div")
  popup.className = "popup-overlay"

  const enderecoSalvo = JSON.parse(localStorage.getItem("endereco")) || {
    cep: "",
    cidade: "",
    estado: "",
    bairro: "",
    rua: "",
    numero: "",
    complemento: "",
  }

  const conteudo = `
        <div class="popup-content">
            <span class="popup-close">&times;</span>
            <h2>Endereço de Entrega</h2>
            <p>Preencha os dados do seu endereço para continuar.</p>
            <form id="form-endereco">
                <input type="text" id="cep" placeholder="CEP (xxxxx-xxx)" value="${enderecoSalvo.cep}" maxlength="9" required><br>
                <input type="text" id="cidade" placeholder="Cidade" value="${enderecoSalvo.cidade}" required><br>
                <input type="text" id="estado" placeholder="Estado (ex: SP)" value="${enderecoSalvo.estado}" maxlength="2" required><br>
                <input type="text" id="bairro" placeholder="Bairro" value="${enderecoSalvo.bairro}" required><br>
                <input type="text" id="rua" placeholder="Rua" value="${enderecoSalvo.rua}" required><br>
                <input type="text" id="numero" placeholder="Número" value="${enderecoSalvo.numero}" required><br>
                <input type="text" id="complemento" placeholder="Complemento (opcional)" value="${enderecoSalvo.complemento}">
            </form>
            <button type="button" class="btn-salvar-endereco">Salvar Endereço</button>
        </div>
    `

  popup.innerHTML = conteudo
  document.body.appendChild(popup)

  popup.querySelector(".popup-close").addEventListener("click", () => {
    popup.remove()
    abrirFormularioFinalizar(carrinho, itensRestantes, cupomAplicado)
  })

  /* ---------- validações de inputs ---------- */
  const cepInput = popup.querySelector("#cep")
  cepInput.addEventListener("input", () => {
    let value = cepInput.value.replace(/\D/g, "")
    if (value.length > 8) value = value.slice(0, 8)
    if (value.length > 5) {
      cepInput.value = value.slice(0, 5) + "-" + value.slice(5)
    } else {
      cepInput.value = value
    }
  })
  ;["#cidade", "#bairro", "#rua"].forEach((id) => {
    const input = popup.querySelector(id)
    input.addEventListener("input", () => {
      input.value = window.capitalizeWords(input.value)
    })
  })

  const estadoInput = popup.querySelector("#estado")
  estadoInput.addEventListener("input", () => {
    estadoInput.value = estadoInput.value
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .slice(0, 2)
  })

  const numeroInput = popup.querySelector("#numero")
  numeroInput.addEventListener("input", () => {
    numeroInput.value = numeroInput.value.replace(/\D/g, "")
  })

  /* ---------- salvar endereço ---------- */
  popup.querySelector(".btn-salvar-endereco").addEventListener("click", () => {
    const form = popup.querySelector("#form-endereco")

    const novoEndereco = {
      cep: form.querySelector("#cep").value,
      cidade: form.querySelector("#cidade").value,
      estado: form.querySelector("#estado").value,
      bairro: form.querySelector("#bairro").value,
      rua: form.querySelector("#rua").value,
      numero: form.querySelector("#numero").value,
      complemento: form.querySelector("#complemento").value,
    }

    if (!/^\d{5}-\d{3}$/.test(novoEndereco.cep)) {
      mostrarPopupAlerta("CEP inválido. Use o formato xxxxx-xxx.", "error")
      return
    }
    if (novoEndereco.estado.length !== 2) {
      mostrarPopupAlerta("Estado deve ter 2 letras (ex: SP).", "error")
      return
    }
    if (
      !novoEndereco.cidade ||
      !novoEndereco.estado ||
      !novoEndereco.bairro ||
      !novoEndereco.rua ||
      !novoEndereco.numero
    ) {
      mostrarPopupAlerta("Por favor, preencha todos os campos obrigatórios.", "warning")
      return
    }

    localStorage.setItem("endereco", JSON.stringify(novoEndereco))
    mostrarPopupAlerta("Endereço salvo com sucesso!", "success")
    popup.remove()
    abrirFormularioFinalizar(carrinho, itensRestantes, cupomAplicado)
  })
}

/* ======================================= */
/* TELA DE FINALIZAR COMPRA (Corrigida e com Múltiplos Cupons) */
/* ======================================= */
function abrirFormularioFinalizar(carrinho, itensRestantes, cupomAplicado) {
  fecharPopups()

  // 🔴 ONDE VOCÊ DEVE INSERIR NOVOS CUPONS 🔴
  const CUPONS = {
    LUXCA: 10,
    LUXCAA: 20,
    LUXCAAA: 30,
    FREE: 100,
  }

  const popup = document.createElement("div")
  popup.className = "popup-finalizar"

  const subtotal = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0)
  const frete = 10.99

  let valorDesconto = 0
  let percentualDescontoAplicado = 0

  if (cupomAplicado) {
    const percentual = CUPONS[cupomAplicado.codigo]

    if (percentual) {
      percentualDescontoAplicado = percentual
      valorDesconto = subtotal * (percentualDescontoAplicado / 100)
    }
  }

  const total = subtotal - valorDesconto + frete
  const totalFormatado = total.toFixed(2)

  const enderecoSalvo = JSON.parse(localStorage.getItem("endereco"))
  const enderecoPreenchido = enderecoSalvo && enderecoSalvo.rua && enderecoSalvo.numero

  let conteudo = `
        <div class="popup-content">
            <span class="popup-close">&times;</span>
            <h2>Finalizar Compra</h2>
    `

  carrinho.forEach((item) => {
    conteudo += `
            <div class="carrinho-item">
                <img src="${item.imagem}" alt="${item.nome}" style="width:60px; border-radius:6px; margin:5px;">
                <div style="flex:1; margin-left:10px;">
                    <p><strong>${item.nome}</strong> (${item.quantidade}x)</p>
                    <p>R$ ${(item.preco * item.quantidade).toFixed(2)}</p>
                </div>
            </div>
            <hr>
        `
  })

  conteudo += `
        <h3>Resumo do Pedido (${carrinho.length} Itens)</h3>
        <p><strong>Sub-total:</strong> R$ ${subtotal.toFixed(2)}</p>
        <p><strong>Frete:</strong> R$ ${frete.toFixed(2)}</p>
        
        ${valorDesconto > 0 ? `<p style="color: green;"><strong>Desconto (${percentualDescontoAplicado}%):</strong> - R$ ${valorDesconto.toFixed(2)}</p>` : ""}
        
        <p><strong>Total:</strong> R$ ${totalFormatado}</p>
        <hr>

        <div style="margin-bottom: 20px;">
            <label for="cupom">Cupom de Desconto:</label>
            <input type="text" id="cupom" placeholder="Digite seu cupom" style="width: 70%; display: inline-block;">
            <button type="button" id="btn-aplicar-cupom" style="width: 28%; padding: 8px 0; margin: 0;">Enviar</button>
            <p id="cupom-message" style="margin-top: 5px; color: red; font-size: 14px;"></p>
        </div>

        <h3>Entrega:</h3>
        <p>
            ${
              enderecoPreenchido
                ? `<strong>Endereço:</strong> ${enderecoSalvo.rua}, ${enderecoSalvo.numero}, ${enderecoSalvo.bairro} - ${enderecoSalvo.cidade}/${enderecoSalvo.estado} <br> 
                <small>CEP: ${enderecoSalvo.cep}</small>`
                : '<strong style="color: red;">Endereço não preenchido!</strong>'
            }
        </p>
        
        <button type="button" class="btn-endereco-entrega" style="margin-top: 15px;">
            Endereço para Entrega
        </button>

        <h3>Método de Pagamento:</h3>
        <select id="pagamento" required>
            <option value="">Selecione</option>
            <option value="Cartão de Crédito">Cartão de Crédito</option>
            <option value="Pix">Pix</option>
            <option value="Boleto">Boleto</option>
        </select>

        <button type="button" class="btn-finalizar-pedido">Finalizar Pedido</button>
        </div>
    `

  popup.innerHTML = conteudo

  document.body.appendChild(popup)

  popup.querySelector(".popup-close").addEventListener("click", () => popup.remove())

  const cupomInput = popup.querySelector("#cupom")
  const btnCupom = popup.querySelector("#btn-aplicar-cupom")
  const cupomMessage = popup.querySelector("#cupom-message")

  if (cupomAplicado) {
    cupomInput.value = cupomAplicado.codigo
    cupomInput.disabled = true
    btnCupom.disabled = true
    cupomMessage.textContent = "Cupom já aplicado!"
    cupomMessage.style.color = "green"
  }

  btnCupom.addEventListener("click", () => {
    const codigo = cupomInput.value.toUpperCase().trim()

    if (cupomAplicado) {
      cupomMessage.textContent = "Você só pode adicionar um cupom por pedido"
      return
    }

    const percentual = CUPONS[codigo]

    if (percentual) {
      mostrarPopupAlerta(`Cupom ${percentual}% aplicado com sucesso!`, "success")
      abrirFormularioFinalizar(carrinho, itensRestantes, { codigo: codigo })
    } else {
      cupomMessage.textContent = "Cupom inválido ou expirado."
    }
  })

  popup.querySelector(".btn-endereco-entrega").addEventListener("click", () => {
    abrirFormularioEndereco(carrinho, subtotal, frete, total, itensRestantes, cupomAplicado)
  })

  popup.querySelector(".btn-finalizar-pedido").addEventListener("click", () => {
    const pagamento = popup.querySelector("#pagamento").value
    const endereco = JSON.parse(localStorage.getItem("endereco"))

    if (!enderecoPreenchido) {
      mostrarPopupAlerta("Por favor, preencha o Endereço para Entrega.", "warning")
      return
    }

    if (!pagamento) {
      mostrarPopupAlerta("Por favor, selecione o método de pagamento.", "warning")
      return
    }

    if (itensRestantes !== null) {
      localStorage.setItem("carrinho", JSON.stringify(itensRestantes))
      atualizarContadorCarrinho()
    }

    popup.remove()

    // Criar popup de confirmação
    const confirmPopup = document.createElement("div")
    confirmPopup.className = "popup-overlay"
    confirmPopup.innerHTML = `
      <div class="popup-content" style="max-width: 400px; text-align: center;">
        <h2 style="color: #4CAF50; margin-bottom: 20px;">Pedido finalizado!</h2>
        <p><strong>Total:</strong> R$ ${totalFormatado}</p>
        <p><strong>Pagamento:</strong> ${pagamento}</p>
        <p><strong>Entrega em:</strong> ${endereco.rua}, ${endereco.numero}, ${endereco.bairro} - ${endereco.cidade}/${endereco.estado}</p>
        <p><strong>CEP:</strong> ${endereco.cep}</p>
        ${valorDesconto > 0 ? `<p style="color: green;"><strong>Desconto Aplicado:</strong> R$ ${valorDesconto.toFixed(2)} (${percentualDescontoAplicado}%)</p>` : ""}
        <button type="button" class="btn-ok" style="margin-top: 20px; padding: 10px 30px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">OK</button>
      </div>
    `

    document.body.appendChild(confirmPopup)

    // Botão OK fecha o popup
    confirmPopup.querySelector(".btn-ok").addEventListener("click", () => {
      confirmPopup.remove()
    })

    // Auto-close após 5 segundos
    setTimeout(() => {
      if (confirmPopup.parentElement) {
        confirmPopup.remove()
      }
    }, 5000)
  })
}
