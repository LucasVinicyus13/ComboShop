import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  updateEmail,
  updatePassword,
  deleteUser,
  signOut,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB3nNcUzB2pTxwY0HoMZEE3FS3x9XWy2ig",
  authDomain: "comboshop-f5fa7.firebaseapp.com",
  projectId: "comboshop-f5fa7",
  storageBucket: "comboshop-f5fa7.appspot.com",
  messagingSenderId: "4699060626",
  appId: "1:4699060626:web:a8a4c46f4c3d4ffcb40a69"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Seletores
const nomeCompletoEl = document.getElementById("nomeCompleto");
const nomeUsuarioEl = document.getElementById("nomeUsuario");
const emailEl = document.getElementById("email");
const cpfEl = document.getElementById("cpf");
const senhaEl = document.getElementById("senha");
const imgPreview = document.getElementById("profileImage");
const imgInput = document.getElementById("imageUpload");

const editarBtn = document.getElementById("editarBtn");
const alterarSenhaBtn = document.getElementById("alterarSenhaBtn");
const sairBtn = document.getElementById("sairBtn");
const excluirBtn = document.getElementById("excluirBtn");

let usuarioAtual = null;
let dadosDoc = null;

// ✅ Verifica se há usuário logado
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Nenhum usuário logado. Redirecionando para login...");
    window.location.href = "https://combo-shop.vercel.app/login/login.html";
    return;
  }

  usuarioAtual = user;
  const userRef = doc(db, "usuarios", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    alert("Usuário não encontrado no banco de dados.");
    return;
  }

  dadosDoc = userSnap.data();

  // Exibe informações
  nomeCompletoEl.value = dadosDoc.nomeCompleto || "";
  nomeUsuarioEl.value = dadosDoc.nomeUsuario || "";
  emailEl.value = dadosDoc.email || "";
  cpfEl.value = dadosDoc.cpf ? dadosDoc.cpf.replace(/(\d{3})\.(\d{3})\.(\d{3})-(\d{2})/, "000.***.***-00") : "";
  senhaEl.value = "********";
  imgPreview.src = dadosDoc.fotoPerfil || "./images/profile.png";
});

// ✅ Editar perfil
editarBtn.addEventListener("click", async () => {
  if (!usuarioAtual) return;

  const novoNomeUsuario = nomeUsuarioEl.value.trim();
  const novoEmail = emailEl.value.trim();

  try {
    if (novoEmail !== usuarioAtual.email) {
      await updateEmail(usuarioAtual, novoEmail);
    }

    const userRef = doc(db, "usuarios", usuarioAtual.uid);
    await updateDoc(userRef, {
      nomeUsuario: novoNomeUsuario,
      email: novoEmail
    });

    alert("Perfil atualizado com sucesso!");
  } catch (error) {
    alert("Erro ao atualizar perfil: " + error.message);
  }
});

// ✅ Alterar senha
alterarSenhaBtn.addEventListener("click", async () => {
  if (!usuarioAtual) return;

  const senhaAtual = prompt("Digite sua senha atual:");
  const novaSenha = prompt("Digite sua nova senha:");
  const confirmarSenha = prompt("Confirme sua nova senha:");

  if (!senhaAtual || !novaSenha || !confirmarSenha) {
    alert("Preencha todos os campos.");
    return;
  }
  if (novaSenha !== confirmarSenha) {
    alert("As senhas não coincidem.");
    return;
  }

  try {
    const cred = EmailAuthProvider.credential(usuarioAtual.email, senhaAtual);
    await reauthenticateWithCredential(usuarioAtual, cred);
    await updatePassword(usuarioAtual, novaSenha);
    alert("Senha alterada com sucesso!");
  } catch (error) {
    alert("Erro ao alterar senha: " + error.message);
  }
});

// ✅ Sair
sairBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "https://combo-shop.vercel.app/login/login.html";
});

// ✅ Excluir conta
excluirBtn.addEventListener("click", async () => {
  if (!usuarioAtual) return;

  const confirmar = confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.");
  if (!confirmar) return;

  try {
    const userRef = doc(db, "usuarios", usuarioAtual.uid);
    await deleteDoc(userRef);
    await deleteUser(usuarioAtual);
    alert("Conta excluída com sucesso!");
    window.location.href = "https://combo-shop.vercel.app/register/register.html";
  } catch (error) {
    alert("Erro ao excluir conta: " + error.message);
  }
});

// ✅ Atualiza foto de perfil
imgInput.addEventListener("change", () => {
  const file = imgInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      imgPreview.src = e.target.result;

      if (usuarioAtual) {
        const userRef = doc(db, "usuarios", usuarioAtual.uid);
        await updateDoc(userRef, { fotoPerfil: e.target.result });
      }
    };
    reader.readAsDataURL(file);
  }
});
