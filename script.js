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

/* --- Registro --- */
window.validarFormulario = async function (event) {
  event.preventDefault();

  const fullname = document.getElementById("fullname")?.value.trim();
  const username = document.getElementById("username")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  let cpf = document.getElementById("cpf")?.value;
  const password = document.getElementById("password")?.value;

  if (!fullname || !username || !email || !cpf || !password) {
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
    alert("A senha deve conter no mínimo 8 dígitos, 1 número, 1 letra e 1 caractere especial.");
    return;
  }

  const qEmail = query(usersRef, where("email", "==", email));
  const qCpf = query(usersRef, where("cpf", "==", cpf));
  const qUser = query(usersRef, where("username", "==", username));
  const [emailSnap, cpfSnap, userSnap] = await Promise.all([getDocs(qEmail), getDocs(qCpf), getDocs(qUser)]);

  if (!emailSnap.empty || !cpfSnap.empty || !userSnap.empty) {
    alert("Já existe um usuário com esse email, CPF ou nome de usuário.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    await addDoc(usersRef, {
      fullname,
      username,
      email,
      cpf,
      userId: uid,
      createdAt: new Date()
    });

    alert("Cadastro realizado com sucesso!");
    window.location.href = "https://combo-shop.vercel.app/products/produtos.html";
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    alert("Erro ao registrar: " + error.code);
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "https://combo-shop.vercel.app/products/produtos.html";
  }
});
