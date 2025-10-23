import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { 
  getAuth, onAuthStateChanged, updateEmail, updatePassword, reauthenticateWithCredential, 
  EmailAuthProvider, deleteUser 
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { 
  getFirestore, doc, getDoc, updateDoc 
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { 
  getStorage, ref, uploadBytes, getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

// Config Firebase
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

// Referências DOM
const fullname = document.getElementById("fullname");
const username = document.getElementById("username");
const email = document.getElementById("email");
const cpf = document.getElementById("cpf");
const editBtn = document.getElementById("edit-btn");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");
const alertMsg = document.getElementById("alert");
const changePasswordBtn = document.getElementById("change-password-btn");
const passwordForm = document.getElementById("password-form");
const savePasswordBtn = document.getElementById("save-password-btn");
const deleteAccountBtn = document.getElementById("delete-account-btn");
const fileInput = document.getElementById("file-input");
const uploadBtn = document.getElementById("upload-btn");
const profilePic = document.getElementById("profile-pic");

// Carrinho
const btnCarrinhoDesktop = document.getElementById("btn-carrinho-desktop");
const btnCarrinhoMobile = document.getElementById("btn-carrinho-mobile");
const contadorDesktop = document.getElementById("contador-desktop");
const contadorMobile = document.getElementById("contador-mobile");
const cartPopup = document.getElementById("cart-popup");

// Estado inicial
let userDocRef;
let originalData = {};
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Atualizar contador
function atualizarContador() {
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  contadorDesktop.textContent = count;
  contadorMobile.textContent = count;
}
atualizarContador();

// Exibir carrinho
function mostrarCarrinho() {
  if (cart.length === 0) {
    cartPopup.innerHTML = "<p>Seu carrinho está vazio!</p>";
  } else {
    cartPopup.innerHTML = `
      <h3>Seu Carrinho</h3>
      ${cart.map(item => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-img">
          <div class="cart-info">
            <p><strong>${item.name}</strong></p>
            <p>R$ ${item.price.toFixed(2)}</p>
          </div>
          <div class="cart-qty">
            <button class="qty-btn" data-name="${item.name}" data-action="decrease"><</button>
            <span>${item.quantity}</span>
            <button class="qty-btn" data-name="${item.name}" data-action="increase">></button>
          </div>
          <p class="cart-total">R$ ${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      `).join("")}
    `;
  }
  cartPopup.classList.toggle("hidden");
}

// Eventos carrinho
btnCarrinhoDesktop.addEventListener("click", mostrarCarrinho);
btnCarrinhoMobile.addEventListener("click", mostrarCarrinho);

cartPopup.addEventListener("click", (e) => {
  if (e.target.classList.contains("qty-btn")) {
    const name = e.target.dataset.name;
    const action = e.target.dataset.action;
    const product = cart.find(i => i.name === name);
    if (action === "increase") product.quantity++;
    else if (action === "decrease" && product.quantity > 1) product.quantity--;
    localStorage.setItem("cart", JSON.stringify(cart));
    atualizarContador();
    mostrarCarrinho();
  }
});

// Autenticação
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../login/login.html";
    return;
  }

  userDocRef = doc(db, "usuarios", user.uid);
  const userSnap = await getDoc(userDocRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    fullname.value = data.nomeCompleto || "";
    username.value = data.nomeUsuario || "";
    email.value = user.email;
    cpf.value = data.cpf ? `000.${data.cpf.slice(3,6)}.***-00` : "";

    originalData = { 
      nomeCompleto: fullname.value, 
      nomeUsuario: username.value, 
      email: email.value 
    };

    // Foto de perfil
    if (data.profilePicURL) {
      profilePic.src = data.profilePicURL;
    } else {
      profilePic.src = "./images/usuario.png";
    }
  }
});

// Editar perfil
editBtn.addEventListener("click", () => {
  username.readOnly = false;
  email.readOnly = false;
  saveBtn.classList.remove("hidden");
  cancelBtn.classList.remove("hidden");
  editBtn.classList.add("hidden");
});

cancelBtn.addEventListener("click", () => {
  username.value = originalData.nomeUsuario;
  email.value = originalData.email;
  username.readOnly = true;
  email.readOnly = true;
  saveBtn.classList.add("hidden");
  cancelBtn.classList.add("hidden");
  editBtn.classList.remove("hidden");
});

saveBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    if (email.value !== originalData.email) await updateEmail(user, email.value);
    await updateDoc(userDocRef, { nomeUsuario: username.value, email: email.value });
    
    alertMsg.classList.remove("hidden");
    setTimeout(() => alertMsg.classList.add("hidden"), 3000);
    
    originalData.email = email.value;
    originalData.nomeUsuario = username.value;

    username.readOnly = true;
    email.readOnly = true;
    saveBtn.classList.add("hidden");
    cancelBtn.classList.add("hidden");
    editBtn.classList.remove("hidden");
  } catch (err) {
    console.error("Erro ao atualizar:", err);
  }
});

// Upload foto
uploadBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const user = auth.currentUser;
  const storageRef = ref(storage, `profilePictures/${user.uid}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  await updateDoc(userDocRef, { profilePicURL: url });
  profilePic.src = url;
});

// Alterar senha
changePasswordBtn.addEventListener("click", () => passwordForm.classList.toggle("hidden"));
savePasswordBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  const currentPassword = document.getElementById("current-password").value;
  const newPassword = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (newPassword !== confirmPassword) {
    alert("As senhas não coincidem!");
    return;
  }

  try {
    const cred = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, cred);
    await updatePassword(user, newPassword);
    alert("Senha alterada com sucesso!");
    passwordForm.classList.add("hidden");
  } catch (err) {
    alert("Erro ao alterar senha: " + err.message);
  }
});

// Excluir conta
deleteAccountBtn.addEventListener("click", async () => {
  const confirmDelete = confirm("Tem certeza que deseja excluir sua conta?");
  if (!confirmDelete) return;

  const user = auth.currentUser;
  try {
    await deleteUser(user);
    alert("Conta excluída com sucesso!");
    window.location.href = "../login/login.html";
  } catch (err) {
    alert("Erro ao excluir conta: " + err.message);
  }
});
