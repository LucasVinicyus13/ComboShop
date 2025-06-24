import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

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

// Máscara CPF
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
  let cpf = document.getElementById("cpf").value.replace(/\D/g, '');
  const password = document.getElementById("password").value;

  if (!fullname || !username || !cpf || !password) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

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

  // 🔍 Verificar se o CPF ou nome de usuário já existem
  const usuariosRef = collection(db, "usuarios");

  const qCpf = query(usuariosRef, where("cpf", "==", cpf));
  const qUser = query(usuariosRef, where("username", "==", username));

  const [cpfSnap, userSnap] = await Promise.all([getDocs(qCpf), getDocs(qUser)]);

  if (!cpfSnap.empty || !userSnap.empty) {
    abrirPopup(); // CPF ou usuário já existem
    return;
  }

  // ✅ Cadastrar novo usuário
  await addDoc(usuariosRef, {
    fullname,
    username,
    cpf,
    password
  });

  // Redireciona
  window.location.href = "https://combo-shop.vercel.app/products/produtos.html";
}

window.validarFormulario = validarFormulario;

// Funções do popup
function abrirPopup() {
  document.getElementById("popup-existe").style.display = "flex";
}

function fecharPopup() {
  document.getElementById("popup-existe").style.display = "none";
}
