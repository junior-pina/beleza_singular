document.addEventListener("DOMContentLoaded", function () {
  console.log("Script carregado com sucesso!");

  /** ======== Botão de Voltar ao Início ======== **/
  const voltarBtn = document.getElementById("voltar-btn");
  if (voltarBtn) {
    voltarBtn.addEventListener("click", function () {
      console.log("Voltando para tela inicial...");
      const agendamentoSection = document.getElementById("agendamento-section");
      const heroSection = document.querySelector(".hero-section");

      if (agendamentoSection) agendamentoSection.classList.add("d-none");
      if (heroSection) heroSection.classList.remove("d-none");
    });
  }

  /** ======== Alternância entre Modo Claro e Escuro ======== **/
  const themeSwitch = document.getElementById("theme-switch");
  const body = document.body;

  if (themeSwitch) {
    themeSwitch.addEventListener("change", function () {
      body.classList.toggle("dark-mode");
      localStorage.setItem("dark-mode", body.classList.contains("dark-mode"));
    });

    // Aplicar tema salvo do usuário
    if (localStorage.getItem("dark-mode") === "true") {
      body.classList.add("dark-mode");
      themeSwitch.checked = true;
    }
  }

  /** ======== API Functions ======== **/
  const api = {
    login: async (email, password) => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log("Login bem-sucedido!");
          alert("Login bem-sucedido!");
          window.location.href = "/dashboard"; // Redireciona para o painel
        } else {
          console.warn("Erro no login:", data.message);
          alert(`Erro: ${data.message}`);
        }
      } catch (error) {
        console.error("Erro ao fazer login:", error);
        alert("Erro ao conectar-se ao servidor.");
      }
    },
  };

  /** ======== Ação de Login ======== **/
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      console.log("Tentando fazer login...");
      
      const email = loginForm.querySelector("input[type='email']").value.trim();
      const password = loginForm.querySelector("input[type='password']").value.trim();

      if (!email || !password) {
        alert("Por favor, preencha todos os campos.");
        return;
      }

      api.login(email, password);
    });
  }
});
