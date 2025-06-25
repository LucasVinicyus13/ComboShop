import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

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

// Formatação do CPF
const cpfInput = document.getElementById("cpf");
cpfInput.addEventListener("input", () => {
  let value = cpfInput.value.replace(/\D/g, "");
  if (value.length > 11) value = value.slice(0, 11);
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  cpfInput.value = value;
});

// Função principal de validação
document.getElementById("formulario").addEventListener("submit", async function (event) {
  event.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const username = document.getElementById("username").value.trim();
  const cpf = document.getElementById("cpf").value.replace(/[^\d]/g, "");
  const password = document.getElementById("password").value;

  if (!fullname || !username || !cpf || !password) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  const regexCPF = /^\d{11}$/;
  if (!regexCPF.test(cpf)) {
    alert("CPF inválido. Deve conter 11 dígitos numéricos.");
    return;
  }

  const regexSenha = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!"'@#$%*()_\-+=\[\]´`^~\?\/;:.,\\]).{8,}$/;
  if (!regexSenha.test(password)) {
    alert("A senha deve conter no mínimo 8 caracteres, incluindo uma letra, um número e um símbolo.");
    return;
  }

  const usuariosRef = collection(db, "usuarios");

  const q = query(usuariosRef, where("cpf", "==", cpf));
  const q2 = query(usuariosRef, where("username", "==", username));
  const [cpfSnap, userSnap] = await Promise.all([getDocs(q), getDocs(q2)]);

  if (!cpfSnap.empty || !userSnap.empty) {
    mostrarPopup();
    return;
  }

  await addDoc(usuariosRef, { fullname, username, cpf, password });

  window.location.href = "https://combo-shop.vercel.app/products/produtos.html";
});

function mostrarPopup() {
  const popup = document.getElementById("popup");
  popup.style.display = "block";
  setTimeout(() => {
    popup.style.display = "none";
  }, 6000);
}
