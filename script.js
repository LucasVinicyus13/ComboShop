import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB3nNcUzB2pTxwY0HoMZEE3FS3x9XWy2ig",
  authDomain: "comboshop-f5fa7.firebaseapp.com",
  projectId: "comboshop-f5fa7",
  storageBucket: "comboshop-f5fa7.appspot.com",
  messagingSenderId: "4699060626",
  appId: "1:4699060626:web:a8a4c46f4c3d4ffcb40a69"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Captura dos elementos HTML
const form = document.getElementById("registerForm");
const nomeCompleto = document.getElementById("nomeCompleto");
const nomeUsuario = document.getElementById("nomeUsuario");
const email = document.getElementById("email");
const cpf = document.getElementById("cpf");
const senha = document.getElementById("senha");

// Função para exibir pop-up estilizado
function mostrarPopup(mensagem, botaoTexto, link) {
  const popup = document.createElement("div");
  popup.innerHTML = `
    <div style="
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background-color: rgba(0,0,0,0.6);
      display: flex; align-items: center; justify-content: center;
      z-index: 9999;">
      <div style="
        background: linear-gradient(135deg, #321152, #4b0082);
        color: white;
        padding: 20px;
        border-radius: 15px;
        text-align: center;
        width: 300px;">
        <h3>${mensagem}</h3>
        <a href="${link}" style="
          display: inline-block;
          margin-top: 15px;
          background-color: #6a0dad;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;">
          ${botaoTexto}
        </a>
      </div>
    </div>
  `;
  document.body.appendChild(popup);
}

// Evento de envio do formulário
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = nomeCompleto.value.trim();
  const usuario = nomeUsuario.value.trim();
  const emailValor = email.value.trim();
  const cpfValor = cpf.value.trim();
  const senhaValor = senha.value.trim();

  if (!nome || !usuario || !emailValor || !cpfValor || !senhaValor) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  try {
    // 🔎 Verifica se já existe usuário com o mesmo CPF ou nome de usuário
    const usuariosRef = collection(db, "usuarios");
    const q = query(
      usuariosRef,
      where("cpf", "==", cpfValor)
    );
    const q2 = query(
      usuariosRef,
      where("nomeUsuario", "==", usuario)
    );

    const cpfSnap = await getDocs(q);
    const usuarioSnap = await getDocs(q2);

    if (!cpfSnap.empty || !usuarioSnap.empty) {
      mostrarPopup(
        "Já existe um usuário com esse nome de usuário ou CPF. É você?",
        "Fazer login",
        "https://combo-shop.vercel.app/login/login.html"
      );
      return;
    }

    // Cria o usuário no Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, emailValor, senhaValor);
    const user = userCredential.user;

    // Salva os dados do usuário no Firestore
    await setDoc(doc(db, "usuarios", user.uid), {
      nomeCompleto: nome,
      nomeUsuario: usuario,
      email: emailValor,
      cpf: cpfValor,
      criadoEm: serverTimestamp(),
      uid: user.uid
    });

    alert("Registro realizado com sucesso!");
    window.location.href = "https://combo-shop.vercel.app/products/produtos.html";

  } catch (error) {
    console.error("Erro ao registrar:", error);
    if (error.code === "auth/email-already-in-use") {
      mostrarPopup(
        "Este e-mail já está em uso. Deseja fazer login?",
        "Ir para login",
        "https://combo-shop.vercel.app/login/login.html"
      );
    } else if (error.code === "permission-denied") {
      alert("Erro: Missing or insufficient permissions. Verifique suas regras do Firestore.");
    } else {
      alert("Erro ao registrar: " + error.message);
    }
  }
});
