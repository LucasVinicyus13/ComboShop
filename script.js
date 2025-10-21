import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

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
const auth = getAuth(app);
const usersRef = collection(db, "usuarios");

const cpfInput = document.getElementById("cpf");
cpfInput.addEventListener("input", () => {
  let value = cpfInput.value.replace(/\D/g, "");
  if (value.length > 11) value = value.slice(0, 11);
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  cpfInput.value = value;
});

window.validarFormulario = async function (event) {
  event.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const username = document.getElementById("username").value.trim();
  let cpf = document.getElementById("cpf").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!fullname || !username || !cpf || !password) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  cpf = cpf.replace(/[^\d]/g, "");
  const regexCPF = /^\d{11}$/;
  if (!regexCPF.test(cpf)) {
    alert("CPF inválido. O CPF deve conter 11 dígitos.");
    return;
  }

  const regexSenha = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!"'@#$%*()_\-+=\[\]´^~\?\/;:.,\\]).{8,}$/;
  if (!regexSenha.test(password)) {
    alert("Sua senha deve conter no mínimo 8 dígitos, 1 número, 1 letra e 1 caractere especial.");
    return;
  }

  // Verifica se CPF ou usuário já existem
  const existingCpf = await getDocs(query(usersRef, where("cpf", "==", cpf)));
  const existingUser = await getDocs(query(usersRef, where("username", "==", username)));

  if (!existingCpf.empty || !existingUser.empty) {
    document.getElementById("popup").style.display = "block";
    return;
  }

  try {
    // Cria usuário no Firebase Auth (usando username como "email fake")
    const emailFake = `${username}@comboshop.com`;
    const userCredential = await createUserWithEmailAndPassword(auth, emailFake, password);
    const user = userCredential.user;

    // Salva no Firestore com o mesmo UID
    await setDoc(doc(db, "usuarios", user.uid), {
      fullname,
      username,
      cpf,
      password,
      endereco: "",
      fotoURL: ""
    });

    window.location.href = "https://combo-shop.vercel.app/products/produtos.html";
  } catch (error) {
    console.error("Erro ao registrar:", error.message);
    alert("Erro ao registrar usuário: " + error.message);
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "https://combo-shop.vercel.app/products/produtos.html";
  }
});
