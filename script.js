import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ======= CONFIGURAÇÃO DO FIREBASE =======
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ======= MÁSCARA DE CPF =======
const cpfInput = document.getElementById("cpf");
cpfInput.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não é número
  if (value.length > 11) value = value.slice(0, 11); // Limita a 11 números
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  e.target.value = value;
});

// ======= POP-UP DE AVISO =======
const popup = document.getElementById("popup");
function mostrarPopup() {
  popup.style.display = "block";
  popup.style.opacity = "1";
  setTimeout(() => {
    popup.style.opacity = "0";
    setTimeout(() => (popup.style.display = "none"), 500);
  }, 4000);
}

// ======= REGISTRO =======
const formulario = document.getElementById("formulario");
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nomeCompleto = document.getElementById("fullname").value.trim();
  const nomeUsuario = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  const senha = document.getElementById("password").value.trim();

  try {
    // Verifica duplicados no Firestore
    const usuariosRef = collection(db, "usuarios");

    const q1 = query(usuariosRef, where("cpf", "==", cpf));
    const q2 = query(usuariosRef, where("nomeUsuario", "==", nomeUsuario));

    const [cpfSnap, userSnap] = await Promise.all([getDocs(q1), getDocs(q2)]);

    if (!cpfSnap.empty || !userSnap.empty) {
      mostrarPopup();
      return;
    }

    // Cria o usuário no Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // Após autenticar, salva os dados no Firestore
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await addDoc(collection(db, "usuarios"), {
          uid: currentUser.uid,
          nomeCompleto,
          nomeUsuario,
          email,
          cpf,
          criadoEm: new Date()
        });

        alert("✅ Registro concluído com sucesso!");
        window.location.href = "https://combo-shop.vercel.app/products/produtos.html";
      }
    });
  } catch (error) {
    console.error("Erro ao registrar:", error);
    alert("❌ Erro ao registrar: " + error.message);
  }
});
