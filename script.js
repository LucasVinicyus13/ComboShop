// Máscara do CPF
const cpfInput = document.getElementById('cpf');
cpfInput.addEventListener('input', () => {
  let value = cpfInput.value.replace(/\D/g, '');

  if (value.length > 11) value = value.slice(0, 11);

  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  cpfInput.value = value;
});

// Validação do formulário
function validarFormulario(event) {
  event.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const username = document.getElementById("username").value.trim();
  let cpf = document.getElementById("cpf").value.trim();
  const password = document.getElementById("password").value;

  if (!fullname || !username || !cpf || !password) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  cpf = cpf.replace(/[^\d]/g, '');
  const regexCPF = /^\d{11}$/;
  if (!regexCPF.test(cpf)) {
    alert("CPF inválido. O CPF deve conter 11 dígitos.");
    return;
  }

  const regexSenha = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!"'@#$%*()_\-+=\[\]´`^~\?\/;:.,\\]).{8,}$/;
  if (!regexSenha.test(password)) {
    alert("Sua senha deve conter no mínimo 8 dígitos, 1 número, 1 letra e 1 caractere especial.");
    return;
  }

  // Salvar no localStorage (ou Firebase, se desejar)
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const jaExiste = usuarios.some(user => user.cpf === cpf || user.username === username);

  if (jaExiste) {
    alert("Já existe um usuário com esse nome de usuário ou CPF. É você? Fazer login.");
    return;
  }

  usuarios.push({ fullname, username, cpf, password });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  // ✅ Redirecionar para página de produtos
  window.location.href = "https://combo-shop.vercel.app/products/produtos.html";
}

// Conectar o submit ao JavaScript
document.getElementById("formulario").addEventListener("submit", validarFormulario);
