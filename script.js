// ======= IMPORTAÇÕES DO FIREBASE =======
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged 
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

// ======= FUNÇÃO DE MÁSCARA CPF =======
function aplicarMascaraCPF(valor) {
  valor = valor.replace(/\D/g, ""); // Remove tudo que não for número
  valor = valor.slice(0, 11); // Limita a 11 dígitos
  valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
  valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
  valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return valor;
}

// ======= LÓGICA DO FORMULÁRIO =======
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formulario");
  const cpfInput = document.getElementById("cpf");

  // Adiciona máscara de CPF em tempo real
  if (cpfInput) {
    cpfInput.addEventListener("input", (e) => {
      e.target.value = aplicarMascaraCPF(e.target.value);
    });
  }

  if (!form) {
    console.error("⚠️ Formulário de registro não encontrado!");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const cpf = document.getElementById("cpf").value.replace(/\D/g, ""); // remove pontuações para salvar limpo
    const password = document.getElementById("password").value.trim();

    if (!fullname || !username || !email || !cpf || !password) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      // Cria conta de autenticação
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Aguarda autenticação para salvar dados
      onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          await addDoc(collection(db, "usuarios"), {
            uid: currentUser.uid,
            fullname,
            username,
            email,
            cpf, // salvo sem pontos e traço
            criadoEm: new Date().toISOString()
          });

          alert("✅ Registro concluído com sucesso!");
          window.location.href = "https://combo-shop.vercel.app/products/produtos.html";
        }
      });
    } catch (error) {
      console.error("Erro ao registrar:", error.code, error.message);
      alert("❌ Erro ao registrar: " + error.message);
    }
  });
});
