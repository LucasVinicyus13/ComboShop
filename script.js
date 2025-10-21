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

/* --- Formatar CPF --- */
const cpfInput = document.getElementById("cpf");
cpfInput.addEventListener("input", () => {
  let value = cpfInput.value.replace(/\D/g, "");
  if (value.length > 11) value = value.slice(0, 11);
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  cpfInput.value = value;
});

/* --- Registro --- */
window.validarFormulario = async function (event) {
  event.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const username = document.getElementById("username").value.trim();
  let cpf = document.getElementById("cpf").value;
  const password = document.getElementById("password").value;

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

  // --- Verificar duplicidade ---
  const qCpf = query(usersRef, where("cpf", "==", cpf));
  const qUser = query(usersRef, where("username", "==", username));
  const [cpfSnap, userSnap] = await Promise.all([getDocs(qCpf), getDocs(qUser)]);

  if (!cpfSnap.empty || !userSnap.empty) {
    // Mostrar popup estilizado
    const popup = document.createElement("div");
    popup.className = "popup-overlay";
    popup.innerHTML = `
      <div class="popup-content" style="text-align:center;">
        <h3>Já existe um usuário com esse nome de usuário ou CPF.</h3>
        <p>É você?</p>
        <a href="https://combo-shop.vercel.app/login/login.html" 
           style="color:#3498db; font-weight:bold; text-decoration:none;">
          Fazer login
        </a>
        <br><br>
        <button id="fechar-popup" 
                style="background:#555; color:white; border:none; padding:6px 14px; border-radius:5px; cursor:pointer;">
          Fechar
        </button>
      </div>
    `;
    document.body.appendChild(popup);
    popup.querySelector("#fechar-popup").addEventListener("click", () => popup.remove());
    return;
  }

  // --- Criar no Authentication ---
  try {
    const fakeEmail = `${username}@comboshop.com`;
    await createUserWithEmailAndPassword(auth, fakeEmail, password);

    // --- Criar no Firestore ---
    await addDoc(usersRef, { fullname, username, cpf, password });

    alert("Cadastro realizado com sucesso!");
    window.location.href = "https://combo-shop.vercel.app/products/produtos.html";
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    alert("Erro ao registrar usuário. Tente novamente.");
  }
};

/* --- Verificação de login automático --- */
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "https://combo-shop.vercel.app/products/produtos.html";
  }
});
