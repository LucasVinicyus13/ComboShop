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

const cpfInput = document.getElementById('cpf');

cpfInput.addEventListener('input', () => {
  let value = cpfInput.value.replace(/\D/g, '');

  if (value.length > 11) value = value.slice(0, 11);

  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  cpfInput.value = value;
});

document.getElementById("formulario").addEventListener("submit", async (event) => {
  event.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const username = document.getElementById("username").value.trim();
  const cpf = document.getElementById("cpf").value.replace(/\D/g, '');
  const password = document.getElementById("password").value;

  if (!fullname || !username || !cpf || !password) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  if (!/^\d{11}$/.test(cpf)) {
    alert("CPF inválido. Deve conter 11 dígitos numéricos.");
    return;
  }

  const senhaValida = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!"'@#$%*()_\-+=\[\]´`^~\?\/;:.,\\]).{8,}$/;
  if (!senhaValida.test(password)) {
    alert("A senha precisa ter no mínimo 8 caracteres, incluindo uma letra, um número e um caractere especial.");
    return;
  }

  const usuariosRef = collection(db, "usuarios");

  const consultaCPF = query(usuariosRef, where("cpf", "==", cpf));
  const consultaUsername = query(usuariosRef, where("username", "==", username));

  const [cpfDocs, usernameDocs] = await Promise.all([
    getDocs(consultaCPF),
    getDocs(consultaUsername)
  ]);

  if (!cpfDocs.empty || !usernameDocs.empty) {
    document.getElementById("popup").classList.remove("hidden");
    return;
  }

  await addDoc(usuariosRef, { fullname, username, cpf, password });

  window.location.href = "https://combo-shop.vercel.app/products/produtos.html";
});

window.fecharPopup = function () {
  document.getElementById("popup").classList.add("hidden");
};
