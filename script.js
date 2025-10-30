// ======= CONFIGURAÇÃO DO FIREBASE =======
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ======= SEU FIREBASE CONFIG =======
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ======= REGISTRO =======
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nomeCompleto = document.getElementById("nomeCompleto").value.trim();
  const nomeUsuario = document.getElementById("nomeUsuario").value.trim();
  const email = document.getElementById("email").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  const senha = document.getElementById("senha").value.trim();

  try {
    // Cria o usuário na autenticação
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    console.log("Usuário criado com sucesso:", user.uid);

    // Aguarda o login estar ativo
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log("Usuário autenticado:", currentUser.uid);

        // Salva os dados no Firestore
        await addDoc(collection(db, "usuarios"), {
          uid: currentUser.uid,
          nomeCompleto,
          nomeUsuario,
          email,
          cpf,
          criadoEm: new Date()
        });

        alert("✅ Registro realizado com sucesso!");
        window.location.href = "https://combo-shop.vercel.app/products/produtos.html";
      }
    });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    alert("❌ Erro ao registrar: " + error.message);
  }
});
