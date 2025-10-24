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

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAMpbU5K-LpvnDqG-2UOncbbOMSijch19c",
  authDomain: "comboshop-66b1c.firebaseapp.com",
  projectId: "comboshop-66b1c",
  storageBucket: "comboshop-66b1c.appspot.com",
  messagingSenderId: "607173380854",
  appId: "1:607173380854:web:60b02791198cdc113e7ad7"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const usersRef = collection(db, "usuarios");

// Máscara de CPF
const cpfInput = document.getElementById("cpf");
cpfInput.addEventListener("input", () => {
  let value = cpfInput.value.replace(/\D/g, "");
  if (value.length > 11) value = value.slice(0, 11);
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  cpfInput.value = value;
});

// Função principal de registro
window.validarFormulario = async function (event) {
  event.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  let cpf = document.getElementById("cpf").value;
  const password = document.getElementById("password").value;
  const fotoPerfil = "./images/usuario.png";

  // Validação básica
  if (!fullname || !username || !cpf || !email || !password) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  // Validação CPF
  cpf = cpf.replace(/[^\d]/g, "");
  const regexCPF = /^\d{11}$/;
  if (!regexCPF.test(cpf)) {
    alert("CPF inválido. O CPF deve conter 11 dígitos.");
    return;
  }

  // Validação senha
  const regexSenha = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!"'@#$%*()_\-+=\[\]´^~\?\/;:.,\\]).{8,}$/;
  if (!regexSenha.test(password)) {
    alert("A senha deve ter no mínimo 8 caracteres, com 1 número, 1 letra e 1 caractere especial.");
    return;
  }

  // Verifica duplicação
  const qCpf = query(usersRef, where("cpf", "==", cpf));
  const qUser = query(usersRef, where("username", "==", username));
  const qEmail = query(usersRef, where("email", "==", email));

  const [cpfSnap, userSnap, emailSnap] = await Promise.all([
    getDocs(qCpf),
    getDocs(qUser),
    getDocs(qEmail)
  ]);

  if (!cpfSnap.empty || !userSnap.empty || !emailSnap.empty) {
    const popup = document.getElementById("popup");
    popup.style.display = "block";
    setTimeout(() => (popup.style.display = "none"), 5000);
    return;
  }

  // Criação no Firebase Auth + Firestore
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("✅ Usuário criado com UID:", user.uid);

    const docRef = await addDoc(usersRef, {
      uid: user.uid,
      fullname,
      username,
      cpf,
      email,
      fotoPerfil,
      criadoEm: new Date()
    });

    console.log("✅ Documento Firestore criado:", docRef.id);

    alert("Registro realizado com sucesso!");
    window.location.href = "https://combo-shop.vercel.app/products/produtos.html";
  } catch (error) {
    console.error("❌ Erro detalhado ao registrar:", error);
    if (error.code === "auth/email-already-in-use") {
      alert("Este e-mail já está em uso.");
    } else if (error.code === "permission-denied") {
      alert("Sem permissão para salvar no Firestore. Verifique suas regras no console do Firebase.");
    } else {
      alert("Erro ao registrar: " + error.message);
    }
  }
};

// Redireciona se já estiver logado
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "https://combo-shop.vercel.app/products/produtos.html";
  }
});
