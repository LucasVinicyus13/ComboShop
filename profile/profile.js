import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  signOut
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-storage.js";

// 🔧 Config Firebase
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

// 🧠 Campos
const fullnameInput = document.getElementById("fullname");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const cpfInput = document.getElementById("cpf");
const profilePic = document.getElementById("profile-pic");
const uploadPic = document.getElementById("upload-pic");

const btnEdit = document.getElementById("btn-edit-profile");
const btnSave = document.getElementById("btn-save");
const btnCancel = document.getElementById("btn-cancel");
const editActions = document.getElementById("edit-actions");

const btnChangePass = document.getElementById("btn-change-password");
const passBox = document.getElementById("password-box");
const btnSavePass = document.getElementById("btn-save-pass");
const btnCancelPass = document.getElementById("btn-cancel-pass");

const logoutBtn = document.getElementById("logout-btn");
const deleteBtn = document.getElementById("delete-btn");

let originalData = {};
let currentUserRef;

// 🔑 Autenticação
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "https://combo-shop.vercel.app/index.html";
    return;
  }

  currentUserRef = doc(db, "usuarios", user.uid);
  const snap = await getDoc(currentUserRef);

  if (snap.exists()) {
    const data = snap.data();
    fullnameInput.value = data.nomeCompleto || "";
    usernameInput.value = data.username || "";
    emailInput.value = user.email || "";
    cpfInput.value = data.cpf ? maskCPF(data.cpf) : "";
    profilePic.src = data.fotoURL || "./images/profile.png";

    originalData = { ...data, email: user.email };
  } else {
    alert("Erro ao carregar informações do usuário.");
  }
});

// 🪄 Editar perfil
btnEdit.addEventListener("click", () => {
  usernameInput.removeAttribute("readonly");
  emailInput.removeAttribute("readonly");
  editActions.style.display = "flex";
});

btnCancel.addEventListener("click", () => {
  usernameInput.value = originalData.username;
  emailInput.value = originalData.email;
  usernameInput.setAttribute("readonly", true);
  emailInput.setAttribute("readonly", true);
  editActions.style.display = "none";
});

btnSave.addEventListener("click", async () => {
  const user = auth.currentUser;
  const newUsername = usernameInput.value.trim();
  const newEmail = emailInput.value.trim();

  try {
    if (newEmail !== originalData.email) {
      await updateEmail(user, newEmail);
    }

    await updateDoc(currentUserRef, {
      username: newUsername,
      email: newEmail,
    });

    showPopup("Suas informações foram alteradas com sucesso!");
    usernameInput.setAttribute("readonly", true);
    emailInput.setAttribute("readonly", true);
    editActions.style.display = "none";
    originalData.username = newUsername;
    originalData.email = newEmail;
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    alert("Erro ao atualizar perfil.");
  }
});

// 📸 Upload de foto
uploadPic.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const user = auth.currentUser;
  const imgRef = ref(storage, `fotosPerfil/${user.uid}.jpg`);
  await uploadBytes(imgRef, file);
  const url = await getDownloadURL(imgRef);

  await updateDoc(currentUserRef, { fotoURL: url });
  profilePic.src = url;
  showPopup("Foto de perfil atualizada!");
});

// 🔒 Alterar senha
btnChangePass.addEventListener("click", () => {
  passBox.style.display = "block";
});

btnCancelPass.addEventListener("click", () => {
  passBox.style.display = "none";
});

btnSavePass.addEventListener("click", async () => {
  const user = auth.currentUser;
  const current = document.getElementById("current-password").value;
  const nova = document.getElementById("new-password").value;
  const confirmar = document.getElementById("confirm-password").value;

  if (nova !== confirmar) {
    alert("As senhas não coincidem.");
    return;
  }

  try {
    const cred = EmailAuthProvider.credential(user.email, current);
    await reauthenticateWithCredential(user, cred);
    await updatePassword(user, nova);
    showPopup("Senha alterada com sucesso!");
    passBox.style.display = "none";
  } catch (error) {
    alert("Senha atual incorreta.");
  }
});

// 🚪 Sair
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "https://combo-shop.vercel.app/index.html";
});

// 💀 Excluir conta
deleteBtn.addEventListener("click", async () => {
  const confirma = confirm("Tem certeza que deseja excluir sua conta?");
  if (!confirma) return;

  const senha = prompt("Digite sua senha para confirmar:");
  if (!senha) return;

  try {
    const user = auth.currentUser;
    const cred = EmailAuthProvider.credential(user.email, senha);
    await reauthenticateWithCredential(user, cred);

    // Exclui do Firestore
    await deleteDoc(doc(db, "usuarios", user.uid));
    await deleteUser(user);

    alert("Conta excluída com sucesso.");
    window.location.href = "https://combo-shop.vercel.app/register/registro.html";
  } catch (error) {
    alert("Senha incorreta ou erro ao excluir conta.");
  }
});

// 🧮 Máscara CPF
function maskCPF(cpf) {
  if (!cpf) return "";
  return cpf.replace(/(\d{3})\d{3}\d{3}(\d{2})/, "$1.***.***-$2");
}

// ✨ Popup suave
function showPopup(msg) {
  const popup = document.getElementById("popup-msg");
  popup.textContent = msg;
  popup.style.display = "block";
  setTimeout(() => (popup.style.display = "none"), 3000);
}

// 🍔 Menu hambúrguer
document.getElementById("menu-toggle").addEventListener("click", function () {
  this.classList.toggle("open");
  document.getElementById("mobile-menu").classList.toggle("active");
});
