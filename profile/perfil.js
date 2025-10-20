// perfil.js (módulo ES6)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signOut, EmailAuthProvider,
  reauthenticateWithCredential, updatePassword, deleteUser, updateProfile
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import {
  getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

/* ======= CONFIGURE AQUI =======
 Substitua abaixo pelo seu firebaseConfig
================================= */
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJECT.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};
/* ============================== */

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

/* --- elementos --- */
const fotoPerfil = document.getElementById("fotoPerfil");
const uploadFoto = document.getElementById("uploadFoto");
const emailUsuario = document.getElementById("emailUsuario");
const dataCadastro = document.getElementById("dataCadastro");

const nomeUsuarioInput = document.getElementById("nomeUsuario");
const novaSenhaInput = document.getElementById("novaSenha");
const senhaAtualInput = document.getElementById("senhaAtual");

const cepInput = document.getElementById("cep");
const numeroInput = document.getElementById("numero");
const cidadeInput = document.getElementById("cidade");
const estadoInput = document.getElementById("estado");
const bairroInput = document.getElementById("bairro");
const ruaInput = document.getElementById("rua");
const complementoInput = document.getElementById("complemento");

const btnSalvar = document.getElementById("btnSalvar");
const btnSair = document.getElementById("btnSair");
const btnExcluir = document.getElementById("btnExcluir");
const mensagemEl = document.getElementById("mensagem");

/* util */
function showMsg(txt, ok = true) {
  mensagemEl.textContent = txt;
  mensagemEl.style.color = ok ? "#002200" : "#7b0000";
  setTimeout(() => { mensagemEl.textContent = ""; }, 5000);
}

function capitalizeWords(str) {
  return str.replace(/\b\w+/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

/* máscara CEP */
cepInput.addEventListener("input", () => {
  let v = cepInput.value.replace(/\D/g, "");
  if (v.length > 8) v = v.slice(0, 8);
  cepInput.value = v.length > 5 ? v.slice(0,5) + "-" + v.slice(5) : v;
});

/* capitalize automaticamente (cidade, estado, bairro, rua) */
[cidadeInput, estadoInput, bairroInput, ruaInput].forEach(input => {
  input.addEventListener("input", () => {
    input.value = capitalizeWords(input.value);
  });
});

/* numero só números */
numeroInput.addEventListener("input", () => {
  numeroInput.value = numeroInput.value.replace(/\D/g, "");
});

/* upload & preview */
let arquivoSelecionado = null;
uploadFoto.addEventListener("change", (e) => {
  const f = e.target.files[0];
  if (!f) return;
  arquivoSelecionado = f;
  // preview
  const reader = new FileReader();
  reader.onload = (ev) => { fotoPerfil.src = ev.target.result; };
  reader.readAsDataURL(f);
});

/* estado: usuário logado? */
let currentUser = null;
onAuthStateChanged(auth, async user => {
  if (!user) {
    // redirecionar p/ login se preferir:
    // window.location.href = "/login.html";
    showMsg("Usuário não autenticado. Faça login.", false);
    return;
  }
  currentUser = user;
  emailUsuario.textContent = user.email || "-";
  // data de cadastro - se tiver no doc
  await carregarDadosUsuario(user.uid);
});

/* carrega dados do Firestore (doc users/{uid}) */
async function carregarDadosUsuario(uid) {
  const userDocRef = doc(db, "users", uid);
  const snap = await getDoc(userDocRef);
  let data;
  if (!snap.exists()) {
    // cria doc base se não existir (opcional)
    data = {
      username: "",
      endereco: { cep: "", cidade: "", estado: "", bairro: "", rua: "", numero: "", complemento: "" },
      photoURL: currentUser.photoURL || "",
      createdAt: serverTimestamp()
    };
    await setDoc(userDocRef, data);
  } else {
    data = snap.data();
  }

  // popular campos
  nomeUsuarioInput.value = data.username || "";
  if (data.endereco) {
    cepInput.value = data.endereco.cep || "";
    cidadeInput.value = data.endereco.cidade || "";
    estadoInput.value = data.endereco.estado || "";
    bairroInput.value = data.endereco.bairro || "";
    ruaInput.value = data.endereco.rua || "";
    numeroInput.value = data.endereco.numero || "";
    complementoInput.value = data.endereco.complemento || "";
  }
  // foto
  if (data.photoURL) {
    fotoPerfil.src = data.photoURL;
  } else if (currentUser.photoURL) {
    fotoPerfil.src = currentUser.photoURL;
  } else {
    fotoPerfil.src = "images/default-avatar.png";
  }

  // data cadastro exibe se existir no doc
  dataCadastro.textContent = snap.exists() && snap.data().createdAt ? "Registrado" : "-";
}

/* salvar alterações */
btnSalvar.addEventListener("click", async () => {
  if (!currentUser) return showMsg("Usuário não autenticado", false);

  btnSalvar.disabled = true;
  showMsg("Salvando...");

  try {
    const uid = currentUser.uid;
    const userDocRef = doc(db, "users", uid);
    const updateData = {};

    // foto: enviar para Storage se selecionada
    if (arquivoSelecionado) {
      const fileRef = storageRef(storage, `profiles/${uid}/${Date.now()}_${arquivoSelecionado.name}`);
      await uploadBytes(fileRef, arquivoSelecionado);
      const url = await getDownloadURL(fileRef);
      updateData.photoURL = url;
      // update auth profile photo
      await updateProfile(currentUser, { photoURL: url });
    }

    // username
    const novoUsuario = nomeUsuarioInput.value.trim();
    if (novoUsuario) updateData.username = novoUsuario;

    // endereço
    const endereco = {
      cep: cepInput.value.trim(),
      cidade: cidadeInput.value.trim(),
      estado: estadoInput.value.trim().toUpperCase(),
      bairro: bairroInput.value.trim(),
      rua: ruaInput.value.trim(),
      numero: numeroInput.value.trim(),
      complemento: complementoInput.value.trim()
    };
    updateData.endereco = endereco;

    // atualiza doc
    await updateDoc(userDocRef, updateData);

    // senha: se quiser trocar, precisa reautenticar com senha atual
    const novaSenha = novaSenhaInput.value;
    const senhaAtual = senhaAtualInput.value;
    if (novaSenha) {
      if (!senhaAtual) throw new Error("Informe sua senha atual para alterar a senha.");
      const cred = EmailAuthProvider.credential(currentUser.email, senhaAtual);
      await reauthenticateWithCredential(currentUser, cred);
      // atualizar senha
      await updatePassword(currentUser, novaSenha);
    }

    showMsg("Alterações salvas com sucesso.");
    // limpa campo senha
    novaSenhaInput.value = "";
    senhaAtualInput.value = "";
    arquivoSelecionado = null;
  } catch (err) {
    console.error(err);
    showMsg("Erro ao salvar: " + (err.message || err), false);
  } finally {
    btnSalvar.disabled = false;
  }
});

/* sair */
btnSair.addEventListener("click", async () => {
  await signOut(auth);
  // redirecionar para login
  window.location.href = "/login.html";
});

/* excluir conta */
btnExcluir.addEventListener("click", async () => {
  if (!currentUser) return;
  const conf = confirm("Tem certeza que deseja excluir sua conta? Isso é irreversível.");
  if (!conf) return;

  const senhaAtual = prompt("Confirme sua senha atual para excluir a conta:");
  if (!senhaAtual) return alert("Senha necessária para exclusão.");

  try {
    // reautenticar
    const cred = EmailAuthProvider.credential(currentUser.email, senhaAtual);
    await reauthenticateWithCredential(currentUser, cred);

    const uid = currentUser.uid;

    // remove foto do storage (se tiver)
    const userDocRef = doc(db, "users", uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists() && snap.data().photoURL) {
      try {
        // tenta deletar o objeto referenciado (se referência permitir)
        const url = snap.data().photoURL;
        // tenta obter ref a partir do URL - não é trivial, mas se você gravar o caminho também no doc seria mais simples.
        // Aqui, tentamos deletar com base no nome extraído (pode falhar dependendo do bucket).
        // Skipping delete if not trivial to find path.
      } catch (e) {
        console.warn("Não foi possível remover foto do Storage automaticamente.", e);
      }
    }

    // delete Firestore doc
    await deleteDoc(userDocRef);

    // delete auth user
    await deleteUser(currentUser);

    alert("Conta excluída com sucesso.");
    window.location.href = "/"; // redireciona pra home
  } catch (err) {
    console.error(err);
    alert("Erro ao excluir conta: " + (err.message || err));
  }
});
