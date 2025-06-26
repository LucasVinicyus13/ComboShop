import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

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

window.login = async function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Preencha todos os campos.");
    return;
  }

  const usersRef = collection(db, "usuarios");
  const q = query(usersRef, where("username", "==", username), where("password", "==", password));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    alert("Nome de usuário ou senha incorretos.");
  } else {
    window.location.href = "https://combo-shop.vercel.app/products/produtos.html";
  }
};

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Usuário já está autenticado, redirecionar para produtos
    window.location.href = "https://combo-shop.vercel.app/products/produtos.html";
  }
});
