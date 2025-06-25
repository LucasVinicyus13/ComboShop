import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAMpbU5K-LpvnDqG-2UOncbbOMSijch19c",
  authDomain: "comboshop-66b1c.firebaseapp.com",
  projectId: "comboshop-66b1c",
  storageBucket: "comboshop-66b1c.appspot.com",
  messagingSenderId: "607173380854",
  appId: "1:607173380854:web:60b02791198cdc113e7ad7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Espera o DOM estar carregado
document.addEventListener('DOMContentLoaded', () => {
  const cpfInput = document.getElementById('cpf');

  // Máscara de CPF
  cpfInput.addEventListener('input', () => {
    let value = cpfInput.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    cpfInput.value = value;
  });

  document.getElementById('registerForm').addEventListener('submit', validarFormulario);
});

async function validarFormulario(event) {
  event.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const username = document.getElementById("username").value.trim();
  let cpf = document.getElementById("cpf").value.trim();
  const password = document.getElementById("password").value;

  if (!fullname || !username || !cpf || !password) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  cpf = cpf.replace(/[^\d]/g, '');

  const regexCPF = /^\d{11}$/;
  if (!regexCPF.test(cpf)) {
    alert("CPF inválido. O CPF deve conter 11 dígitos.");
    return;
  }

  const regexSenha = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!"'@#$%*()_\-+=\[\]´`^~\?\/;:.,\\]).{8,}$/;
  if (!regexSenha.test(password)) {
    alert("Sua senha deve conter no mínimo 8 dígitos, 1 número, 1 letra e 1 caractere especial.");
    return;
  }

  try {
    const usuariosRef = collection(db, "usuarios");

    const q1 = query(usuariosRef, where("cpf", "==", cpf));
    const q2 = query(usuariosRef, where("username", "==", username));

    const [cpfSnapshot, usernameSnapshot] = await Promise.all([
      getDocs(q1),
      getDocs(q2)
    ]);

    if (!cpfSnapshot.empty || !usernameSnapshot.empty) {
      mostrarPopup();
      return;
    }

    // Salva o usuário no Firestore
    await addDoc(usuariosRef, { fullname, username, cpf, password });

    // ✅ Redireciona para produtos
    window.location.href = "https://combo-shop.vercel.app/products/produtos.html";

  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    alert("Erro ao registrar. Tente novamente.");
  }
}

function mostrarPopup() {
  const popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.top = '0';
  popup.style.left = '0';
  popup.style.width = '100vw';
  popup.style.height = '100vh';
  popup.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  popup.style.display = 'flex';
  popup.style.alignItems = 'center';
  popup.style.justifyContent = 'center';
  popup.style.zIndex = '9999';

  popup.innerHTML = `
    <div style="
      background-color: #fff;
      padding: 30px;
      border-radius: 15px;
      text-align: center;
      font-family: 'Manjari', sans-serif;
      box-shadow: 0 0 20px rgba(0,0,0,0.4);
    ">
      <p style="font-size: 20px; margin-bottom: 20px;">Já existe um usuário com esse nome de usuário ou CPF. É você?</p>
      <a href="https://combo-shop.vercel.app/login.html" style="
        background-color: #6a5acd;
        color: white;
        padding: 10px 25px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: bold;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        transition: background-color 0.3s ease;
      " onmouseover="this.style.backgroundColor='#5a4dbf'" onmouseout="this.style.backgroundColor='#6a5acd'">Fazer login</a>
    </div>
  `;

  document.body.appendChild(popup);
}
