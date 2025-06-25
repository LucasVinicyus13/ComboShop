import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, query, where } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAMpbU5K-LpvnDqG-2UOncbbOMSijch19c",
  authDomain: "comboshop-66b1c.firebaseapp.com",
  projectId: "comboshop-66b1c",
  storageBucket: "comboshop-66b1c.firebasestorage.app",
  messagingSenderId: "607173380854",
  appId: "1:607173380854:web:60b02791198cdc113e7ad7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const cpfInput = document.getElementById('cpf');

cpfInput.addEventListener('input', () => {
  let value = cpfInput.value.replace(/\D/g, '');

  if (value.length > 11) value = value.slice(0, 11);

  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  cpfInput.value = value;
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

  const usuariosRef = collection(db, "usuarios");

  const q = query(usuariosRef, where("cpf", "==", cpf));
  const q2 = query(usuariosRef, where("username", "==", username));

  const [cpfSnap, usernameSnap] = await Promise.all([
    getDocs(q),
    getDocs(q2)
  ]);

  if (!cpfSnap.empty || !usernameSnap.empty) {
    mostrarPopup();
    return;
  }

  try {
    await addDoc(usuariosRef, { fullname, username, cpf, password });
    // ✅ Redireciona ao final
    window.location.href = "https://combo-shop.vercel.app/products/produtos.html";
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    alert("Erro ao salvar os dados. Tente novamente.");
  }
}

// Função para exibir pop-up
function mostrarPopup() {
  const popup = document.createElement('div');
  popup.innerHTML = `
    <div style="
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.6);
      display: flex; align-items: center; justify-content: center;
      z-index: 9999;">
      <div style="
        background: white;
        padding: 30px;
        border-radius: 12px;
        text-align: center;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);">
        <p style="font-size: 18px; font-family: 'Manjari', sans-serif;">Já existe um usuário com esse nome de usuário ou CPF. É você?</p>
        <a href="https://combo-shop.vercel.app/login.html"
           style="display: inline-block; margin-top: 15px; padding: 10px 20px;
                  background: #6a5acd; color: white; text-decoration: none;
                  border-radius: 8px; font-weight: bold;">
          Fazer login
        </a>
      </div>
    </div>
  `;
  document.body.appendChild(popup);
}

window.validarFormulario = validarFormulario;
