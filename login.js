import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAMpbU5K-LpvnDqG-2UOncbbOMSijch19c",
  authDomain: "comboshop-66b1c.firebaseapp.com",
  projectId: "comboshop-66b1c",
  storageBucket: "comboshop-66b1c.appspot.com",
  messagingSenderId: "607173380854",
  appId: "1:607173380854:web:60b02791198cdc113e7ad7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.login = async function (event) {
  event.preventDefault();

  // ⚠️ CERTIFIQUE-SE DE QUE O INPUT NO HTML TEM ID="username"
  const username = document.getElementById("username")?.value.trim();
  const password = document.getElementById("password")?.value;

  if (!username || !password) {
    alert("Preencha todos os campos.");
    return;
  }

  // Recria o email falso usado no registro
  const emailFake = `${username}@comboshop.com`;

  try {
    await signInWithEmailAndPassword(auth, emailFake, password);
    window.location.href = "https://combo-shop.vercel.app/products/produtos.html";
  } catch (error) {
    // Exibe o erro no console para depuração, mas mantém a mensagem genérica para o usuário
    console.error("Erro de login:", error.code, error.message);
    alert("Nome de usuário ou senha incorretos.");
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "https://combo-shop.vercel.app/products/produtos.html";
  }
});
