// Configuração do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "combo-shop-66b1c",
  storageBucket: "SEU_BUCKET",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicialização do Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Referências aos elementos do DOM
const form = document.getElementById("registerForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const popupOverlay = document.getElementById("popup-overlay");
const popup = document.getElementById("popup");
const closeBtn = document.getElementById("closePopup");
const loginRedirect = document.getElementById("goToLogin");

// Evento para fechar popup
closeBtn.onclick = () => {
  popupOverlay.classList.add("hidden");
};

// Redirecionar para login
loginRedirect.onclick = () => {
  window.location.href = "login.html";
};

// Evento de envio do formulário
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    alert("Preencha todos os campos.");
    return;
  }

  try {
    // Verifica se já existe um usuário com esse nome ou senha
    const snapshot = await db.collection("usuarios")
      .where("username", "==", username)
      .get();

    if (!snapshot.empty) {
      popupOverlay.classList.remove("hidden");
      return;
    }

    // Adiciona novo usuário
    await db.collection("usuarios").add({
      username,
      password
    });

    // Redireciona para a página de produtos
    window.location.href = "https://combo-shop.vercel.app/products/produtos.html";

  } catch (error) {
    console.error("Erro ao registrar:", error);
    alert("Erro ao registrar usuário. Tente novamente.");
  }
});
