import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
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
const db = getFirestore(app);
const auth = getAuth(app);
const usersRef = collection(db, "usuarios");

// Máscara CPF
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
  const email = document.getElementById("email").value.trim();
  let cpf = document.getElementById("cpf").value;
  const password = document.getElementById("password").value;

  if (!fullname || !username || !cpf || !email || !password) {
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
    alert("A senha deve ter no mínimo 8 caracteres, com 1 número, 1 letra e 1 caractere especial.");
    return;
  }

  try {
    // Verifica se já existe CPF, username ou email cadastrados
    const qCpf = query(usersRef, where("cpf", "==", cpf));
    const qUser = query(usersRef, where("username", "==", username));
    const qEmail = query(usersRef, where("email", "==", email));

    const [cpfSnap, userSnap, emailSnap] = await Promise.all([
      getDocs(qCpf),
      getDocs(qUser),
      getDocs(qEmail)
    ]);

    if (!cpfSnap.empty || !userSnap.empty || !emailSnap.empty) {
      document.getElementById("popup").style.display = "block";
      setTimeout(() => {
        document.getElementById("popup").style.display = "none";
      }, 5000);
      return;
    }

    // Cria usuário no Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Cria documento no Firestore
    await addDoc(usersRef, {
      uid: user.uid,
      fullname,
      username,
      cpf,
      email,
      fotoPerfil: "./images/usuario.png",
      criadoEm: new Date()
    });

    // Redireciona
    window.location.href = "https://combo-shop.vercel.app/products/produtos.html";

  } catch (error) {
    console.error("Erro ao registrar:", error);
    if (error.code === "auth/email-already-in-use") {
      alert("Este e-mail já está em uso.");
    } else {
      alert("Erro ao registrar. Tente novamente.");
    }
  }
};

// Redireciona se já logado
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "https://combo-shop.vercel.app/products/produtos.html";
  }
});
