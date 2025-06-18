const cpfInput = document.getElementById('cpf');  // Input CPF

cpfInput.addEventListener('input', () => {
  let value = cpfInput.value.replace(/\D/g, '');

  if (value.length > 11) value = value.slice(0, 11);

  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  cpfInput.value = value;
});

function validarFormulario(event) {
  event.preventDefault();

  const fullname = document.getElementById("fullname").value;
  const username = document.getElementById("username").value;
  let cpf = document.getElementById("cpf").value;
  const password = document.getElementById("password").value;

  if (!fullname || !username || !cpf || !password) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return false;
  }

  cpf = cpf.replace(/[^\d]/g, '');

  const regexCPF = /^\d{11}$/;
  if (!regexCPF.test(cpf)) {
    alert("CPF inválido. O CPF deve conter 11 dígitos.");
    return false;
  }

  const regexSenha = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!#$%&*]).{8,}$/;
  if (!regexSenha.test(password)) {
    alert("Sua senha deve conter no mínimo 8 dígitos, 1 número, 1 letra e 1 caractere especial (@,!,#,$,%,&,*)");
    return false;
  }

  // ✅ Redireciona para o Google se tudo estiver certo
  window.location.href = "https://combo-shop-products.vercel.app/";
}
