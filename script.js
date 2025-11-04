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

// === Configuração do Firebase (ComboShop) ===
const firebaseConfig = {
  apiKey: "AIzaSyD1sx0hfSY6SYLgV2AIv4mHlU9rHogm9EA",
  authDomain: "comboshop-ff2f3.firebaseapp.com",
  projectId: "comboshop-ff2f3",
  storageBucket: "comboshop-ff2f3.appspot.com",
  messagingSenderId: "224052432585",
  appId: "1:224052432585:web:cfbb1fc3dfd7da6f4e4204"
};

// === Inicialização ===
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// === Máscara de CPF ===
document.getElementById("cpf").addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  e.target.value = value;
});

// === Registro de Usuário ===
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !email || !cpf || !password) {
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
      username,
      email,
      cpf,
      criadoEm: new Date().toISOString()
    });

    alert("Usuário registrado com sucesso!");
    window.location.href = "https://combo-shop.vercel.app/products/produtos.html";

  } catch (error) {
    console.error("Erro no registro:", error);
    alert("Erro: " + error.message);
  }
});
