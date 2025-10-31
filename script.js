import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  updatePassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC3nIYv-x8cKvmK4z8qLrUzO_3gkIfgU8Y",
  authDomain: "comboshop-66b1c.firebaseapp.com",
  projectId: "comboshop-66b1c",
  storageBucket: "comboshop-66b1c.appspot.com",
  messagingSenderId: "937764326932",
  appId: "1:937764326932:web:d47094034c00ef5e2f45b5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Elementos
const nomeCompletoInput = document.getElementById("fullname");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const cpfInput = document.getElementById("cpf");
const editarBtn = document.getElementById("editarBtn");
const alterarSenhaBtn = document.getElementById("alterarSenhaBtn");
const sairBtn = document.getElementById("sairBtn");
const excluirBtn = document.getElementById("excluirBtn");

// Função para exibir alertas personalizados
function alerta(msg) {
  alert(msg);
}

// Verifica usuário logado
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    const userDocRef = doc(db, "usuarios", uid);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      nomeCompletoInput.value = data.fullname || "";
      usernameInput.value = data.username || "";
      emailInput.value = data.email || "";
      cpfInput.value = data.cpf || "";

      // Ativa botões
      editarBtn.disabled = false;
      alterarSenhaBtn.disabled = false;
      sairBtn.disabled = false;
      excluirBtn.disabled = false;
    } else {
      alerta("Usuário não encontrado no banco de dados.");
    }
  } else {
    alerta("Nenhum usuário logado. Redirecionando para login...");
    window.location.href = "/login/login.html";
  }
});

// Editar perfil
editarBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return alerta("Usuário não autenticado.");

  const userDocRef = doc(db, "usuarios", user.uid);
  await updateDoc(userDocRef, {
    fullname: nomeCompletoInput.value,
    username: usernameInput.value,
    email: emailInput.value,
    cpf: cpfInput.value,
  });

  alerta("Perfil atualizado com sucesso!");
});

// Alterar senha
alterarSenhaBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return alerta("Usuário não autenticado.");

  const novaSenha = prompt("Digite sua nova senha:");
  if (novaSenha && novaSenha.length >= 6) {
    await updatePassword(user, novaSenha);
    alerta("Senha alterada com sucesso!");
  } else {
    alerta("A senha deve ter pelo menos 6 caracteres.");
  }
});

// Sair
sairBtn.addEventListener("click", async () => {
  await signOut(auth);
  alerta("Você saiu da conta!");
  window.location.href = "/login/login.html";
});

// Excluir conta
excluirBtn.addEventListener("click", async () => {
  const confirmar = confirm("Tem certeza que deseja excluir sua conta?");
  if (!confirmar) return;

  const user = auth.currentUser;
  if (!user) return alerta("Usuário não autenticado.");

  await deleteDoc(doc(db, "usuarios", user.uid));
  await user.delete();
  alerta("Conta excluída com sucesso!");
  window.location.href = "/login/login.html";
});
