// === Firebase Imports ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  setDoc,
  doc,
  getDocs,
  collection,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// === Configuração Firebase ===
const firebaseConfig = {
  apiKey: "AIzaSyAMpbU5K-LpvnDqG-2UOncbbOMSijch19c",
  authDomain: "comboshop-66b1c.firebaseapp.com",
  projectId: "comboshop-66b1c",
  storageBucket: "comboshop-66b1c.firebasestorage.app",
  messagingSenderId: "607173380854",
  appId: "1:607173380854:web:60b02791198cdc113e7ad7"
};

// === Inicialização ===
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Aguarda o carregamento completo do DOM antes de acessar elementos
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const cpfInput = document.getElementById("cpf");

  if (!form) {
    console.error("❌ Formulário não encontrado! Verifique se o ID está correto (registerForm).");
    return;
  }

  // === Máscara de CPF ===
  cpfInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    e.target.value = value;
  });

  // === Registro de Usuário ===
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!fullname || !username || !email || !cpf || !password) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    try {
      // === Verifica se nome de usuário ou CPF já existem ===
      const usersRef = collection(db, "usuarios");
      const q1 = query(usersRef, where("username", "==", username));
      const q2 = query(usersRef, where("cpf", "==", cpf));

      const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
      if (!snap1.empty || !snap2.empty) {
        alert("Já existe um usuário com esse nome de usuário ou CPF. É você? Faça login!");
        return;
      }

      // === Cria usuário na autenticação ===
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // === Salva dados no Firestore ===
      await setDoc(doc(db, "usuarios", user.uid), {
        uid: user.uid,
        fullname,
        username,
        email,
        cpf,
        criadoEm: new Date().toISOString(),
      });

      alert("Usuário registrado com sucesso!");
      window.location.href = "https://combo-shop.vercel.app/products/produtos.html";

    } catch (error) {
      console.error("🔥 Erro no registro:", error);
      alert("Erro: " + error.message);
    }
  });
});
