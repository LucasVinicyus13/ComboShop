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
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-storage.js";

// firebase config (use a mesma que você já tem)
const firebaseConfig = {
  apiKey: "AIzaSyAMpbU5K-LpvnDqG-2UOncbbOMSijch19c",
  authDomain: "comboshop-66b1c.firebaseapp.com",
  projectId: "comboshop-66b1c",
  storageBucket: "comboshop-66b1c.appspot.com",
  messagingSenderId: "607173380854",
  appId: "1:607173380854:web:60b02791198cdc113e7ad7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

/* DOM */
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

const passwordBox = document.getElementById("password-box");
const currentPass = document.getElementById("current-password");
const newPass = document.getElementById("new-password");
const confirmPass = document.getElementById("confirm-password");
const btnSavePass = document.getElementById("btn-save-pass");
const btnCancelPass = document.getElementById("btn-cancel-pass");

const logoutBtn = document.getElementById("logout-btn");
const deleteBtn = document.getElementById("delete-btn");

/* helper: alert popup (re-using same visual) */
function mostrarPopupAlerta(msg, tipo = "info") {
  const popup = document.createElement("div");
  popup.className = "popup-alerta-overlay";
  const cores = { success: "#4CAF50", warning: "#ff9800", error: "#f44336", info: "#2196F3" };
  const icones = { success: "✓", warning: "⚠", error: "✕", info: "ℹ" };
  const cor = cores[tipo] || cores.info;
  const icone = icones[tipo] || icones.info;
  popup.innerHTML = `
    <div class="popup-alerta-content" style="border-left:4px solid ${cor}">
      <div class="popup-alerta-header" style="background:${cor}"><span class="popup-alerta-icone">${icone}</span></div>
      <div class="popup-alerta-body" style="background:${cor}"><p>${msg}</p></div>
      <button class="popup-alerta-close" style="background:${cor}">OK</button>
    </div>`;
  document.body.appendChild(popup);
  popup.querySelector(".popup-alerta-close").addEventListener("click", () => popup.remove());
  setTimeout(()=> popup.remove(), 4000);
}

/* mask CPF to display 000.***.***-00 */
function maskCpfDisplay(cpf) {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return cpf;
  return `${digits.slice(0,3)}.***.***-${digits.slice(9)}`;
}

/* disable fields initially */
function setReadonlyMode() {
  fullnameEl.readOnly = true;
  usernameEl.readOnly = true;
  emailEl.readOnly = true;
  cpfEl.readOnly = true;
  editActions.style.display = "none";
  passwordBox.style.display = "none";
  btnEdit.disabled = false;
  btnChangePass.disabled = false;
}

/* enable editing for username & email */
function enableEditMode() {
  usernameEl.readOnly = false;
  emailEl.readOnly = false;
  usernameEl.focus();
  editActions.style.display = "flex";
  btnEdit.disabled = true;
  btnChangePass.disabled = true;
}

/* load user data from auth + firestore */
let currentUid = null;
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    mostrarPopupAlerta("Você precisa estar logado para acessar o perfil.", "warning");
    window.location.href = "../login/login.html";
    return;
  }

  currentUid = user.uid;
  try {
    // email from auth
    emailEl.value = user.email || "";

    // get firestore doc by uid
    const docRef = doc(db, "usuarios", user.uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      fullnameEl.value = data.fullname || data.nomeCompleto || "";
      usernameEl.value = data.username || "";
      cpfEl.value = maskCpfDisplay(data.cpf || "");
      // profile picture
      const foto = data.fotoURL || data.fotoPerfil || "";
      if (foto) profilePic.src = foto;
      else profilePic.src = "../images/usuario.png";
    } else {
      // fallback: show what we have
      fullnameEl.value = "";
      usernameEl.value = "";
      cpfEl.value = "";
      profilePic.src = "../images/usuario.png";
    }
  } catch (err) {
    console.error(err);
    mostrarPopupAlerta("Erro ao carregar dados do perfil.", "error");
  }
  setReadonlyMode();
});

/* upload profile picture */
uploadPic.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file || !currentUid) return;
  try {
    const storageRef = ref(storage, `profilePics/${currentUid}.jpg`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    // update firestore
    await updateDoc(doc(db, "usuarios", currentUid), { fotoURL: url });
    profilePic.src = url;
    mostrarPopupAlerta("Foto de perfil atualizada!", "success");
  } catch (err) {
    console.error(err);
    mostrarPopupAlerta("Erro ao enviar foto.", "error");
  }
});

/* Edit profile button */
btnEdit.addEventListener("click", () => {
  enableEditMode();
});

/* Cancel edit */
btnCancel.addEventListener("click", () => {
  // reload values from firestore/auth
  onAuthStateChanged(auth, async (u) => {
    if (!u) return;
    const snap = await getDoc(doc(db, "usuarios", u.uid));
    if (snap.exists()) {
      const d = snap.data();
      usernameEl.value = d.username || "";
      emailEl.value = auth.currentUser?.email || "";
    }
  });
  setReadonlyMode();
});

/* Save edited profile (username and email) */
btnSave.addEventListener("click", async () => {
  if (!currentUid) return;

  const newUsername = usernameEl.value.trim();
  const newEmail = emailEl.value.trim();

  if (!newUsername || !newEmail) {
    mostrarPopupAlerta("Nome de usuário e email não podem ficar vazios.", "warning");
    return;
  }

  try {
    // If email changed, need reauthentication
    const user = auth.currentUser;
    if (user.email !== newEmail) {
      const currentPass = prompt("Para alterar o email, confirme sua senha atual:");
      if (!currentPass) {
        mostrarPopupAlerta("Alteração de email cancelada.", "info");
        return;
      }
      // reauth
      const cred = EmailAuthProvider.credential(user.email, currentPass);
      await reauthenticateWithCredential(user, cred);
      // update email in auth
      await updateEmail(user, newEmail);
    }

    // update firestore username and email
    await updateDoc(doc(db, "usuarios", currentUid), {
      username: newUsername,
      email: newEmail
    });

    mostrarPopupAlerta("Perfil atualizado com sucesso!", "success");
    setReadonlyMode();
  } catch (err) {
    console.error(err);
    mostrarPopupAlerta("Erro ao salvar alterações. Verifique sua senha para mudanças sensíveis.", "error");
  }
});

/* Change password flow */
btnChangePass.addEventListener("click", () => {
  passwordBox.style.display = "block";
  btnEdit.disabled = true;
  btnChangePass.disabled = true;
});

btnCancelPass.addEventListener("click", () => {
  passwordBox.style.display = "none";
  currentPass.value = newPass.value = confirmPass.value = "";
  btnEdit.disabled = false;
  btnChangePass.disabled = false;
});

btnSavePass.addEventListener("click", async () => {
  const cur = currentPass.value;
  const np = newPass.value;
  const cp = confirmPass.value;

  if (!cur || !np || !cp) {
    mostrarPopupAlerta("Preencha todos os campos de senha.", "warning");
    return;
  }
  if (np !== cp) {
    mostrarPopupAlerta("A nova senha e a confirmação não conferem.", "error");
    return;
  }
  const regexSenha = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!"'@#$%*()_\-+=\[\]´^~\?\/;:.,\\]).{8,}$/;
  if (!regexSenha.test(np)) {
    mostrarPopupAlerta("A nova senha não atende aos requisitos de segurança.", "warning");
    return;
  }

  try {
    const user = auth.currentUser;
    // reauth
    const cred = EmailAuthProvider.credential(user.email, cur);
    await reauthenticateWithCredential(user, cred);
    // update password
    await updatePassword(user, np);
    mostrarPopupAlerta("Senha alterada com sucesso!", "success");
    btnCancelPass.click();
  } catch (err) {
    console.error(err);
    mostrarPopupAlerta("Erro ao alterar senha. Verifique sua senha atual.", "error");
  }
});

/* Logout */
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "../login/login.html";
});

/* Delete account */
deleteBtn.addEventListener("click", async () => {
  if (!confirm("Tem certeza que deseja excluir sua conta? Isso é irreversível.")) return;
  try {
    const user = auth.currentUser;
    // reauth
    const senha = prompt("Confirme sua senha para excluir a conta:");
    if (!senha) { mostrarPopupAlerta("Exclusão cancelada.", "info"); return; }
    const cred = EmailAuthProvider.credential(user.email, senha);
    await reauthenticateWithCredential(user, cred);
    // delete firestore doc
    await updateDoc(doc(db, "usuarios", currentUid), { deletedAt: new Date().toISOString() }); // optional soft-delete
    await deleteUser(user);
    mostrarPopupAlerta("Conta excluída.", "success");
    window.location.href = "../login/login.html";
  } catch (err) {
    console.error(err);
    mostrarPopupAlerta("Falha ao excluir conta. Verifique sua senha.", "error");
  }
});

/* header menu toggle & cart counter reuse */
document.getElementById('menu-toggle').addEventListener('click', function(){
  this.classList.toggle('open');
  document.getElementById('mobile-menu').classList.toggle('active');
});
function atualizarContadorCarrinhoProfile(){ 
  const c = JSON.parse(localStorage.getItem("carrinho"))||[];
  const d=document.getElementById("contador-desktop");
  if(d) d.textContent = c.length;
}
window.addEventListener('load', atualizarContadorCarrinhoProfile);
