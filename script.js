// ======= IMPORTAÇÕES DO FIREBASE =======
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  addDoc 
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// ======= CONFIGURAÇÃO DO FIREBASE =======
const firebaseConfig = {
  apiKey: "AIzaSyAMpbU5K-LpvnDqG-2UOncbbOMSijch19c",
  authDomain: "comboshop-66b1c.firebaseapp.com",
  projectId: "comboshop-66b1c",
  storageBucket: "comboshop-66b1c.appspot.com",
  messagingSenderId: "607173380854",
  appId: "1:607173380854:web:60b02791198cdc113e7ad7"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ======= MÁSCARA DE CPF =======
document.addEventListener("DOMContentLoaded", () => {
  const cpfInput = document.getElementById("cpf");

  if (cpfInput) {
    cpfInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não é número
      if (value.length > 11) value = value.slice(0, 11); // Limita a 11 números

      // Aplica a máscara
      value = value
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");

      e.target.value = value;
    });
  }
});

// ======= LÓGICA DO FORMULÁRIO =======
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formulario");

  if (!form) {
    console.error("⚠️ Formulário de registro não encontrado!");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const cpf = document.getElementById("cpf").value.replace(/\D/g, "");
    const password = document.getElementById("password").value.trim();

    if (!fullname || !username || !email || !cpf || !password) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      // Cria conta de autenticação
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Salva informações no Firestore
      await addDoc(collection(db, "usuarios"), {
        uid: user.uid,
        fullname,
        username,
        email,
        cpf,
        criadoEm: new Date().toISOString()
      });

      alert("✅ Registro concluído com sucesso!");
      window.location.href = "https://combo-shop.vercel.app/products/produtos.html";

    } catch (error) {
      console.error("❌ Erro ao registrar:", error.code, error.message);

      if (error.code === "auth/email-already-in-use") {
        alert("⚠️ Esse e-mail já está em uso. Tente fazer login.");
      } else {
        alert("❌ Erro ao registrar: " + error.message);
      }
    }
  });
});
