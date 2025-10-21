import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
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
const db = getFirestore(app);

window.login = async function (event) {
  event.preventDefault();

  const username = document.getElementById("username")?.value.trim();
  const password = document.getElementById("password")?.value;

  if (!username || !password) {
    alert("Preencha todos os campos.");
    return;
  }

  try {
    // 🔍 Busca o e-mail correspondente ao nome de usuário
    const usersRef = collection(db, "usuarios");
    const q = query(usersRef, where("username", "==", username));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      alert("Usuário não encontrado.");
      return;
    }

    // Pega o e-mail real cadastrado
    const userData = snapshot.docs[0].data();
    const email = userData.email;

    // 🔐 Faz login com o e-mail encontrado e a senha digitada
    await signInWithEmailAndPassword(auth, email, password);

    window.location.href = "https://combo-shop.vercel.app/products/produtos.html";
  } catch (error) {
    console.error("Erro de login:", error.code, error.message);
    alert("Nome de usuário ou senha incorretos.");
  }
};

// 🔁 Redireciona se o usuário já estiver logado
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "https://combo-shop.vercel.app/products/produtos.html";
  }
});
