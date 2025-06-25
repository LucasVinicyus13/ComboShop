import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Variáveis globais fornecidas pelo ambiente Canvas
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let userId = null;
let isAuthReady = false;

// Observador do estado de autenticação para garantir que o Firebase esteja pronto
onAuthStateChanged(auth, async (user) => {
  if (user) {
    userId = user.uid;
    console.log("Usuário autenticado:", userId);
  } else {
    // Tenta fazer login anonimamente se não houver token personalizado ou se o usuário sair
    try {
      await signInAnonymously(auth);
      userId = auth.currentUser.uid;
      console.log("Usuário autenticado anonimamente:", userId);
    } catch (error) {
      console.error("Erro na autenticação anônima:", error);
    }
  }
  isAuthReady = true;
});

// Tenta fazer login com token personalizado se disponível
if (initialAuthToken) {
  signInWithCustomToken(auth, initialAuthToken)
    .then((userCredential) => {
      console.log("Autenticação com token personalizada bem-sucedida.");
    })
    .catch((error) => {
      console.error("Erro na autenticação com token personalizada:", error);
      // Retorna para o login anônimo se o token personalizado falhar
      signInAnonymously(auth);
    });
}

const cpfInput = document.getElementById('cpf');
const formulario = document.getElementById('formulario');
const messageModal = document.getElementById('messageModal');
const modalMessage = document.getElementById('modalMessage');
const closeButton = document.querySelector('.close'); // Usa a classe 'close' existente no CSS
const modalLoginLink = document.getElementById('modalLoginLink');

// Mascara de CPF
cpfInput.addEventListener('input', () => {
  let value = cpfInput.value.replace(/\D/g, ''); // Remove tudo que não é dígito

  if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos

  // Aplica a máscara: XXX.XXX.XXX-XX
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  cpfInput.value = value;
});

// Função para exibir o modal de mensagem
function showModal(message, showLoginLink = false) {
  modalMessage.textContent = message;
  if (showLoginLink) {
    modalLoginLink.style.display = 'inline-block';
  } else {
    modalLoginLink.style.display = 'none';
  }
  messageModal.classList.remove('hidden');
}

// Função para esconder o modal de mensagem
function hideModal() {
  messageModal.classList.add('hidden');
}

// Event listener para o botão de fechar o modal
closeButton.addEventListener('click', hideModal);

// Função principal de validação e envio
async function validarFormulario(event) {
  event.preventDefault();

  if (!isAuthReady) {
    showModal("Aguarde, a autenticação está sendo inicializada.");
    return;
  }

  const fullname = document.getElementById("fullname").value.trim();
  const username = document.getElementById("username").value.trim();
  let cpf = document.getElementById("cpf").value.trim();
  const password = document.getElementById("password").value;

  if (!fullname || !username || !cpf || !password) {
    showModal("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  cpf = cpf.replace(/[^\d]/g, ''); // Garante que o CPF esteja apenas com dígitos para validação

  const regexCPF = /^\d{11}$/;
  if (!regexCPF.test(cpf)) {
    showModal("CPF inválido. O CPF deve conter 11 dígitos.");
    return;
  }

  // Regex atualizada para incluir caracteres especiais comuns
  const regexSenha = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]).{8,}$/;
  if (!regexSenha.test(password)) {
    showModal("Sua senha deve conter no mínimo 8 dígitos, 1 número, 1 letra e 1 caractere especial (por exemplo: !, @, #, $, etc...).");
    return;
  }

  try {
    // Garante que o userId esteja disponível antes de prosseguir
    if (!userId) {
      showModal("Erro de autenticação: ID do usuário não disponível. Tente novamente.");
      console.error("UserID é nulo durante o envio do formulário.");
      return;
    }

    // Caminho da coleção ajustado para as regras de segurança do Firestore (dados privados do usuário)
    const usuariosRef = collection(db, `artifacts/${appId}/users/${userId}/usuarios`);

    const q1 = query(usuariosRef, where("cpf", "==", cpf));
    const q2 = query(usuariosRef, where("username", "==", username));

    const [cpfSnapshot, usernameSnapshot] = await Promise.all([
      getDocs(q1),
      getDocs(q2)
    ]);

    if (!cpfSnapshot.empty || !usernameSnapshot.empty) {
      showModal("Já existe um usuário com esse nome de usuário ou CPF. É você?", true); // Passa true para mostrar o link de login
      return;
    }

    // Salva o usuário
    await addDoc(usuariosRef, { fullname, username, cpf, password });

    // Redireciona para página de produtos
    window.location.href = "https://combo-shop.vercel.app/products/produtos.html";

  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    showModal("Erro ao registrar. Tente novamente.");
  }
}

// Adiciona o event listener ao formulário
formulario.addEventListener('submit', validarFormulario);
