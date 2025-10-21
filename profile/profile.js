import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, onAuthStateChanged, updatePassword, deleteUser, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAMpbU5K-LpvnDqG-2UOncbbOMSijch19c",
  authDomain: "comboshop-66b1c.firebaseapp.com",
  projectId: "comboshop-66b1c",
  storageBucket: "comboshop-66b1c.appspot.com",
  messagingSenderId: "607173380854",
  appId: "1:607173380854:web:60b02791198cdc113e7ad7"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Referências DOM
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const enderecoInput = document.getElementById("endereco");
const profilePic = document.getElementById("profile-pic");
const uploadPic = document.getElementById("upload-pic");
const saveBtn = document.getElementById("save-btn");
const logoutBtn = document.getElementById("logout-btn");
const deleteBtn = document.getElementById("delete-btn");

let currentUserId;

// Quando o usuário estiver logado
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = "../login.html";
    return;
  }

  currentUserId = user.uid;
  const docRef = doc(db, "usuarios", user.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    usernameInput.value = data.username || "";
    enderecoInput.value = data.endereco || "";
    profilePic.src = data.fotoURL || "./images/usuario.png";
  }
});

// Upload de foto de perfil
uploadPic.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file || !currentUserId) return;

  const storageRef = ref(storage, `profilePics/${currentUserId}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  await updateDoc(doc(db, "usuarios", currentUserId), { fotoURL: downloadURL });
  profilePic.src = downloadURL;
  alert("Foto de perfil atualizada!");
});

// Salvar alterações
saveBtn.addEventListener("click", async () => {
  if (!currentUserId) return;

  const updates = {
    username: usernameInput.value,
    endereco: enderecoInput.value
  };

  await updateDoc(doc(db, "usuarios", currentUserId), updates);

  if (passwordInput.value.trim() !== "") {
    await updatePassword(auth.currentUser, passwordInput.value.trim());
  }

  alert("Alterações salvas com sucesso!");
});

// Logout
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "../login.html";
});

// Excluir conta
deleteBtn.addEventListener("click", async () => {
  if (confirm("Tem certeza que deseja excluir sua conta? Isso não pode ser desfeito.")) {
    const user = auth.currentUser;
    await deleteUser(user);
    alert("Conta excluída com sucesso.");
    window.location.href = "../login.html";
  }
});
