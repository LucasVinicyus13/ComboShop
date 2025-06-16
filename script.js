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
      // Prevenir o envio do formulário até a validação
      event.preventDefault();

      // Obtendo os campos do formulário
      const fullname = document.getElementById("fullname").value;
      const username = document.getElementById("username").value;
      let cpf = document.getElementById("cpf").value;
      const password = document.getElementById("password").value;

      // Verificando se todos os campos estão preenchidos
      if (!fullname || !username || !cpf || !password) {
          alert("Por favor, preencha todos os campos obrigatórios.");
          return false;
      }

      // Remover qualquer caractere não numérico do CPF (como ponto e hífen)
      cpf = cpf.replace(/[^\d]/g, ''); // Isso vai deixar apenas os números

      // Verificando se o CPF tem 11 dígitos numéricos
      const regexCPF = /^\d{11}$/;
      if (!regexCPF.test(cpf)) {
          alert("CPF inválido. O CPF deve conter 11 dígitos.");
          return false;
      }

       // Verificando se a senha atende os critérios:
      // - mínimo 8 dígitos
      // - pelo menos 1 número
      // - pelo menos 1 letra
      // - pelo menos 1 caractere especial (@,!,#,$,%,&,*)
      const regexSenha = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!#$%&*]).{8,}$/;
      if (!regexSenha.test(password)) {
          alert("Sua senha deve conter no mínimo 8 dígitos, 1 número, 1 letra e 1 caractere especial (@,!,#,$,%,&,*)");
          return false;
   }

      // Se tudo estiver correto, envia o formulário
      document.getElementById("formulario").submit();
  }