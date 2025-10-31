// ======= IMPORTAÇÕES DO FIREBASE =======
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  signOut,
  deleteUser,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged
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

// ======= CONFIGURAÇÃO DO FIREBASE =======
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
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ======= ELEMENTOS HTML =======
const photoInput = document.getElementById("photo");
const photoPreview = document.getElementById("photo-preview");
const fullnameInput = document.getElementById("fullname");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const cpfInput = document.getElementById("cpf");
const editBtn = document.getElementById("edit-btn");
const saveBtn = document.getElementById("save-btn");
const logoutBtn = document.getElementById("logout-btn");
const deleteBtn = document.getElementById("delete-btn");
const changePasswordBtn = document.getElementById("change-password-btn");
const passwordSection = document.getElementById("password-section");
const currentPassword = document.getElementById("current-password");
const newPassword = document.getElementById("new-password");
const confirmPassword = document.getElementById("confirm-password");
const savePasswordBtn = document.getElementById("save-password-btn");

// ======= MÁSCARA CPF =======
cpfInput.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "").slice(0, 11);
  let formatted = value;
  if (value.length > 3) formatted = value.slice(0, 3) + "." + value.slice(3);
  if (value.length > 6) formatted = formatted.slice(0, 7) + "." + value.slice(6);
  if (value.length > 9) formatted = formatted.slice(0, 11) + "-" + value.slice(9);
  e.target.value = formatted;
});

// ======= CARREGA DADOS DO USUÁRIO =======
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../login/login.html";
    return;
  }

  const docRef = doc(db, "usuarios", user.uid);
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    const data = snap.data();

    fullnameInput.value = data.fullname || "";
    usernameInput.value = data.username || "";
    emailInput.value = data.email || "";
    cpfInput.value = data.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.***.***-$4") || "";
    photoPreview.src = data.fotoURL || "./images/profile.png";

    // Bloqueia edição inicialmente
    [usernameInput, emailInput].forEach(el => el.disabled = true);
    photoInput.disabled = true;
  } else {
    alert("Usuário não encontrado no banco de dados.");
  }
});

// ======= EDITAR PERFIL =======
editBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  // Libera campos para edição
  [usernameInput, emailInput].forEach(el => el.disabled = false);
  photoInput.disabled = false;

  editBtn.style.display = "none";
  saveBtn.style.display = "inline-block";
});

saveBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const newUsername = usernameInput.value.trim();
  const newEmail = emailInput.value.trim();

  try {
    // Atualiza email na autenticação
    if (newEmail !== user.email) {
      await updateEmail(user, newEmail);
    }

    // Atualiza foto se enviada
    let photoURL = null;
    if (photoInput.files.length > 0) {
      const file = photoInput.files[0];
      const storageRef = ref(storage, `profile_photos/${user.uid}`);
      await uploadBytes(storageRef, file);
      photoURL = await getDownloadURL(storageRef);
    }

    // Atualiza Firestore
    const userRef = doc(db, "usuarios", user.uid);
    await updateDoc(userRef, {
      username: newUsername,
      email: newEmail,
      fotoURL: photoURL || "./images/profile.png"
    });

    alert("✅ Perfil atualizado com sucesso!");
    window.location.reload();
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    alert("❌ Erro ao atualizar perfil: " + error.message);
  }
});

// ======= ALTERAR SENHA =======
changePasswordBtn.addEventListener("click", () => {
  passwordSection.style.display =
    passwordSection.style.display === "block" ? "none" : "block";
});

savePasswordBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const current = currentPassword.value;
  const nova = newPassword.value;
  const confirmar = confirmPassword.value;

  if (nova !== confirmar) {
    alert("As senhas não coincidem!");
    return;
  }

  try {
    const cred = EmailAuthProvider.credential(user.email, current);
    await reauthenticateWithCredential(user, cred);
    await updatePassword(user, nova);
    alert("✅ Senha alterada com sucesso!");
    passwordSection.style.display = "none";
    currentPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
  } catch (error) {
    alert("❌ Erro ao alterar senha: " + error.message);
  }
});

// ======= SAIR =======
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "../login/login.html";
});

// ======= EXCLUIR CONTA =======
deleteBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const confirmDelete = confirm("Tem certeza que deseja excluir sua conta?");
  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, "usuarios", user.uid));
    await deleteUser(user);
    alert("✅ Conta excluída com sucesso!");
    window.location.href = "../register/register.html";
  } catch (error) {
    alert("❌ Erro ao excluir conta: " + error.message);
  }
});
