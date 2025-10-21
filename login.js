import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

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

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Preencha todos os campos.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "https://combo-shop.vercel.app/products/produtos.html";
  } catch (error) {
    console.error("Erro de login:", error.code, error.message);
    if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found") {
      alert("Email ou senha incorretos.");
    } else {
      alert("Erro ao fazer login. Tente novamente mais tarde.");
    }
  }
};

// 🔁 Redireciona se o usuário já estiver logado
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "https://combo-shop.vercel.app/products/produtos.html";
  }
});
