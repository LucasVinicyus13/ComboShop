// Importações do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDQKZgU6RbRzgh57C1kxu0UtHTvHibTnOE",
  authDomain: "comboshop-66b1c.firebaseapp.com",
  projectId: "comboshop-66b1c",
  storageBucket: "comboshop-66b1c.appspot.com",
  messagingSenderId: "992291895349",
  appId: "1:992291895349:web:06a90ad4a40ffabe0d8c47",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Máscara de CPF ---
const cpfInput = document.getElementById("cpf");
cpfInput.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length > 11) value = value.slice(0, 11);
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  e.target.value = value;
});

// --- Registro ---
document.getElementById("registerBtn").addEventListener("click", async (e) => {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const cpf = document.getElementById("cpf").value.replace(/\D/g, "");
  const password = document.getElementById("password").value.trim();

  if (!fullname || !username || !email || !cpf || !password) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  try {
    // Verifica duplicidade (CPF ou username)
    const usersRef = collection(db, "usuarios");
    const qCPF = query(usersRef, where("cpf", "==", cpf));
    const qUser = query(usersRef, where("username", "==", username));
    const [cpfSnap, userSnap] = await Promise.all([getDocs(qCPF), getDocs(qUser)]);

    if (!cpfSnap.empty || !userSnap.empty) {
      const popup = document.createElement("div");
      popup.innerHTML = `
        <div style="
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.6);
          display: flex; justify-content: center; align-items: center;
          z-index: 9999;">
          <div style="
            background: #fff; color: #333; padding: 20px 30px; border-radius: 15px;
            box-shadow: 0 0 20px rgba(0,0,0,0.3); text-align: center; font-family: Poppins, sans-serif;">
            <h2>Já existe um usuário com esse nome de usuário ou CPF.</h2>
            <p>É você? <a href='login.html' style='color:#6c63ff; text-decoration:none; font-weight:bold;'>Fazer login</a></p>
            <button id="closePopup" style="
              margin-top:10px; background:#6c63ff; color:#fff; border:none; padding:8px 16px;
              border-radius:10px; cursor:pointer;">OK</button>
          </div>
        </div>
      `;
      document.body.appendChild(popup);
      document.getElementById("closePopup").onclick = () => popup.remove();
      return;
    }

    // Cria o usuário no Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Salva dados no Firestore
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
    console.error("Erro ao registrar:", error);
    alert("Erro: " + error.message);
  }
});
