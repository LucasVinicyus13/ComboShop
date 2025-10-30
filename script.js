import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔥 Configuração real do seu Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA8o3UuZgWtwFfVLn1jVwRKKGcK36WRFjQ",
  authDomain: "comboshop-3f1b3.firebaseapp.com",
  projectId: "comboshop-3f1b3",
  storageBucket: "comboshop-3f1b3.appspot.com",
  messagingSenderId: "896785330802",
  appId: "1:896785330802:web:3b9330b1b6ce238b7cf68c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const formulario = document.getElementById("formulario");
const popup = document.getElementById("popup");
const cpfInput = document.getElementById("cpf");

// 🧮 Máscara automática de CPF
cpfInput.addEventListener("input", (e) => {
  let valor = e.target.value.replace(/\D/g, ""); // remove tudo que não for número
  if (valor.length > 11) valor = valor.slice(0, 11);
  valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
  valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
  valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  e.target.value = valor;
});

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nomeCompleto = document.getElementById("fullname").value.trim();
  const nomeUsuario = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  const senha = document.getElementById("password").value.trim();

  try {
    // 🔎 Verifica se já existe CPF ou nome de usuário
    const usuariosRef = collection(db, "usuarios");
    const q = query(usuariosRef, where("cpf", "==", cpf));
    const q2 = query(usuariosRef, where("nomeUsuario", "==", nomeUsuario));
    const [snap1, snap2] = await Promise.all([getDocs(q), getDocs(q2)]);

    if (!snap1.empty || !snap2.empty) {
      popup.style.display = "block";
      return;
    }

    // 🔥 Cria o usuário no Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // 💾 Salva no Firestore
    await addDoc(collection(db, "usuarios"), {
      uid: user.uid,
      nomeCompleto,
      nomeUsuario,
      email,
      cpf,
      criadoEm: new Date()
    });

    alert("✅ Registro concluído com sucesso!");
    window.location.href = "https://combo-shop.vercel.app/products/produtos.html";

  } catch (error) {
    console.error("Erro ao registrar:", error);
    alert("❌ " + error.message);
  }
});
