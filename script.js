// === Firebase Configuração ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyACfEok2lIudcax8QwH6VFaJ4OeYdcLQ4E",
  authDomain: "comboshop-7a3dc.firebaseapp.com",
  projectId: "comboshop-7a3dc",
  storageBucket: "comboshop-7a3dc.appspot.com",
  messagingSenderId: "781234987276",
  appId: "1:781234987276:web:7b4127df8a712a6bcd6f41"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// === Máscara do CPF ===
document.getElementById("cpf").addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length > 11) value = value.slice(0, 11);
  e.target.value = value
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
});

// === Registro de Usuário ===
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  const password = document.getElementById("password").value;

  if (!fullname || !username || !email || !cpf || !password) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    // Verifica se já existe um CPF ou nome de usuário no Firestore
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("cpf", "==", cpf));
    const q2 = query(usersRef, where("username", "==", username));

    const [cpfSnap, userSnap] = await Promise.all([getDocs(q), getDocs(q2)]);

    if (!cpfSnap.empty || !userSnap.empty) {
      // Exibe o popup estilizado
      const popup = document.createElement("div");
      popup.innerHTML = `
        <div style="
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background-color: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999;
        ">
          <div style="
            background: linear-gradient(135deg, #4B0082, #8A2BE2);
            color: white;
            padding: 30px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 0 15px rgba(0,0,0,0.3);
            max-width: 350px;
          ">
            <p>Já existe um usuário com esse nome de usuário ou CPF.</p>
            <p>É você? <a href="/login/login.html" style="color:#00ffff; text-decoration:underline;">Fazer login</a></p>
          </div>
        </div>
      `;
      document.body.appendChild(popup);
      return;
    }

    // Cria o usuário no Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Salva dados no Firestore
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      fullname,
      username,
      email,
      cpf,
    });

    // Redireciona para produtos
    alert("Registro concluído com sucesso!");
    window.location.href = "https://combo-shop.vercel.app/products/produtos.html";

  } catch (error) {
    console.error(error);
    alert("Erro ao registrar: " + error.message);
  }
});
