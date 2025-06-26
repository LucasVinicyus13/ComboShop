import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore, collection, query, where, getDocs, addDoc
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SUA_AUTH_DOMAIN",
  projectId: "comboshop-66b1c",
  storageBucket: "SUA_STORAGE_BUCKET",
  messagingSenderId: "SUA_SENDER_ID",
  appId: "SUA_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const usuariosRef = collection(db, "usuarios");

  const q = query(usuariosRef, where("cpf", "==", cpf));
  const q2 = query(usuariosRef, where("username", "==", username));

  const cpfSnap = await getDocs(q);
  const usernameSnap = await getDocs(q2);

  if (!cpfSnap.empty || !usernameSnap.empty) {
    document.getElementById("popup").classList.remove("hidden");
    return;
  }

  await addDoc(usuariosRef, { fullname, cpf, username, password });

  window.location.href = "https://combo-shop.vercel.app/products/produtos.html";
});

window.fecharPopup = function () {
  document.getElementById("popup").classList.add("hidden");
};
