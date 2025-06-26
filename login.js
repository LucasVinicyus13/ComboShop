import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

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

const cpfInput = document.getElementById("cpf");

cpfInput.addEventListener("input", () => {
  let value = cpfInput.value.replace(/\D/g, "");

  if (value.length > 11) value = value.slice(0, 11);

  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  cpfInput.value = value;
});

async function fazerLogin(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const cpf = document.getElementById("cpf").value.replace(/\D/g, "");

  if (!username || !cpf) {
    alert("Preencha todos os campos.");
    return;
  }

  const usuariosRef = collection(db, "usuarios");
  const snapshot = await getDocs(usuariosRef);
  let encontrado = false;

  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.username === username && data.cpf === cpf) {
      encontrado = true;
    }
  });

  if (encontrado) {
    window.location.href = "https://combo-shop.vercel.app/products/produtos.html";
  } else {
    alert("Usuário ou CPF inválido. Tente novamente.");
  }
}
