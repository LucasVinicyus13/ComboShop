import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  updatePassword,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
  deleteUser,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAMpbU5K-LpvnDqG-2UOncbbOMSijch19c",
  authDomain: "comboshop-66b1c.firebaseapp.com",
  projectId: "comboshop-66b1c",
  storageBucket: "comboshop-66b1c.appspot.com",
  messagingSenderId: "607173380854",
  appId: "1:607173380854:web:60b02791198cdc113e7ad7",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const fullnameEl = document.getElementById("fullname");
const usernameEl = document.getElementById("username");
const emailEl = document.getElementById("email");
const cpfEl = document.getElementById("cpf");
const profilePic = document.getElementById("profile-pic");
const uploadPic = document.getElementById("upload-pic");
const btnEdit = document.getElementById("btn-edit-profile");
const btnChangePass = document.getElementById("btn-change-password");
const editActions = document.getElementById("edit-actions");
const btnSave = document.getElementById("btn-save");
const btnCancel = document.getElementById("btn-cancel");
const logoutBtn = document.getElementById("logout-btn");
const deleteBtn = document.getElementById("delete-btn");

let userData = {};
let currentUid = null;

function mostrarPopupAlerta(msg, tipo = "info") {
  const popup = document.createElement("div");
  popup.className = "popup-alerta-overlay";
  const cores = { success: "#4CAF50", warning: "#ff9800", error: "#f44336", info: "#2196F3" };
  const icones = { success: "✓", warning: "⚠", error: "✕", info: "ℹ" };
  const cor = cores[tipo] || cores.info;
  const icone = icones[tipo] || icones.info;
  popup.innerHTML = `
    <div class="popup-alerta-content" style="border-left:4px solid ${cor}">
      <div class="popup-alerta-header" style="background:${cor}"><span>${icone}</span></div>
      <div class="popup-alerta-body" style="background:${cor}"><p>${msg}</p></div>
      <button class="popup-alerta-close" style="background:${cor}">OK</button>
    </div>`;
  document.body.appendChild(popup);
  popup.querySelector(".popup-alerta-close").addEventListener("click", () => popup.remove());
  setTimeout(() => popup.remove(), 4000);
}

function maskCpf(cpf) {
  const digits = cpf.replace(/\D/g, "");
  return digits.length === 11 ? `${digits.slice(0, 3)}.***.***-${digits.slice(9)}` : cpf;
}

function preencherCampos(data) {
  fullnameEl.value = data.fullname || "";
  usernameEl.value = data.username || "";
  emailEl.value = data.email || "";
  cpfEl.value = maskCpf(data.cpf || "");
  profilePic.src = data.fotoURL || "./images/usuario.png";
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../login/login.html";
    return;
  }
  currentUid = user.uid;

  try {
    const snap = await getDoc(doc(db, "usuarios", currentUid));
    if (snap.exists()) {
      userData = snap.data();
      userData.email = user.email;
      preencherCampos(userData);
    } else {
      mostrarPopupAlerta("Usuário não encontrado no banco de dados.", "warning");
    }
  } catch (e) {
    console.error(e);
  }
});

/* --- Upload foto --- */
uploadPic.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file || !currentUid) return;
  try {
    const storageRef = ref(storage, `profilePics/${currentUid}.jpg`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    await updateDoc(doc(db, "usuarios", currentUid), { fotoURL: url });
    profilePic.src = url;
    mostrarPopupAlerta("Foto de perfil atualizada!", "success");
  } catch {
    mostrarPopupAlerta("Erro ao enviar foto.", "error");
  }
});

/* --- Editar perfil --- */
btnEdit.addEventListener("click", () => {
  usernameEl.readOnly = false;
  emailEl.readOnly = false;
  editActions.style.display = "flex";
});

/* --- Cancelar alterações --- */
btnCancel.addEventListener("click", () => {
  preencherCampos(userData);
  usernameEl.readOnly = true;
  emailEl.readOnly = true;
  editActions.style.display = "none";
});

/* --- Salvar alterações --- */
btnSave.addEventListener("click", async () => {
  const newUsername = usernameEl.value.trim();
  const newEmail = emailEl.value.trim();

  try {
    const updates = { username: newUsername };
    if (auth.currentUser.email !== newEmail) {
      const senha = prompt("Digite sua senha para alterar o email:");
      const cred = EmailAuthProvider.credential(auth.currentUser.email, senha);
      await reauthenticateWithCredential(auth.currentUser, cred);
      await updateEmail(auth.currentUser, newEmail);
      updates.email = newEmail;
    }

    await updateDoc(doc(db, "usuarios", currentUid), updates);
    userData = { ...userData, ...updates };
    mostrarPopupAlerta("Suas informações foram alteradas com sucesso!", "success");
    usernameEl.readOnly = true;
    emailEl.readOnly = true;
    editActions.style.display = "none";
  } catch (e) {
    console.error(e);
    mostrarPopupAlerta("Erro ao salvar. Verifique sua senha se alterou o email.", "error");
  }
});

/* --- Excluir conta --- */
deleteBtn.addEventListener("click", async () => {
  if (!confirm("Deseja realmente excluir sua conta?")) return;
  try {
    const senha = prompt("Digite sua senha para confirmar:");
    const cred = EmailAuthProvider.credential(auth.currentUser.email, senha);
    await reauthenticateWithCredential(auth.currentUser, cred);
    await deleteUser(auth.currentUser);
    mostrarPopupAlerta("Conta excluída com sucesso!", "success");
    window.location.href = "../login/login.html";
  } catch (e) {
    mostrarPopupAlerta("Senha incorreta ou erro ao excluir conta.", "error");
  }
});

/* --- Logout --- */
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "../login/login.html";
});

/* --- Carrinho --- */
function atualizarContadorCarrinho() {
  const itens = JSON.parse(localStorage.getItem("carrinho")) || [];
  document.getElementById("contador-desktop").textContent = itens.length;
}

function abrirCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  let html = "<h2>Seu Carrinho</h2>";
  if (carrinho.length === 0) {
    html += "<p>O carrinho está vazio.</p>";
  } else {
    html += "<ul>";
    carrinho.forEach((item) => {
      html += `<li>${item.nome} - R$${item.preco}</li>`;
    });
    html += "</ul>";
  }

  const modal = document.createElement("div");
  modal.className = "popup-alerta-overlay";
  modal.innerHTML = `
    <div class="popup-alerta-content" style="max-width:500px; background:white; color:black;">
      ${html}
      <button class="popup-alerta-close" style="background:#8b5cf6; color:white;">Fechar</button>
    </div>`;
  document.body.appendChild(modal);
  modal.querySelector(".popup-alerta-close").addEventListener("click", () => modal.remove());
}

document.getElementById("btn-carrinho-desktop").addEventListener("click", abrirCarrinho);
atualizarContadorCarrinho();
