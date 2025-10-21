import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, updatePassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

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

// Verifica usuário logado
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Você precisa estar logado para acessar o perfil.");
    window.location.href = "/login/login.html";
    return;
  }

  const uid = user.uid;
  const docRef = doc(db, "usuarios", uid);
  const docSnap = await getDoc(docRef);

  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const enderecoInput = document.getElementById("endereco");
  const fotoPerfil = document.getElementById("fotoPerfil");

  emailInput.value = user.email || "";

  if (docSnap.exists()) {
    const dados = docSnap.data();
    usernameInput.value = dados.nomeUsuario || "";
    enderecoInput.value = dados.endereco || "";
    if (dados.fotoPerfil) fotoPerfil.src = dados.fotoPerfil;
  }

  // Atualizar imagem
  document.getElementById("inputFoto").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `fotosPerfil/${uid}.jpg`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    fotoPerfil.src = url;

    await updateDoc(docRef, { fotoPerfil: url });
    alert("Foto de perfil atualizada!");
  });

  // Salvar alterações
  document.getElementById("salvarPerfil").addEventListener("click", async () => {
    const novoNome = usernameInput.value.trim();
    const novoEndereco = enderecoInput.value.trim();
    const novaSenha = document.getElementById("senha").value;

    await updateDoc(docRef, {
      nomeUsuario: novoNome,
      endereco: novoEndereco
    });

    if (novaSenha) {
      await updatePassword(user, novaSenha);
    }

    alert("Perfil atualizado com sucesso!");
  });

  // Logout
  document.getElementById("sairConta").addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "/login/login.html";
  });
});
