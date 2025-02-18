document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ Script carregado com sucesso!");

  /** ======== 🔹 Elementos do DOM ======== **/
  const voltarBtn = document.getElementById("voltar-btn");
  const themeSwitch = document.getElementById("theme-switch");
  const body = document.body;
  const userNameDisplay = document.getElementById("user-name"); // Onde o nome do usuário será exibido
  const logoutBtn = document.getElementById("logout-btn"); // Botão de logout

  /** ======== 🔙 Botão de Voltar ao Início ======== **/
  if (voltarBtn) {
      voltarBtn.addEventListener("click", function () {
          console.log("🔙 Voltando para a tela inicial...");
          const agendamentoSection = document.getElementById("agendamento-section");
          const heroSection = document.querySelector(".hero-section");

          if (agendamentoSection) agendamentoSection.classList.add("d-none");
          if (heroSection) heroSection.classList.remove("d-none");
      });
  }

  /** ======== 🌙 Alternância entre Modo Claro e Escuro ======== **/
  if (themeSwitch) {
      themeSwitch.addEventListener("change", function () {
          body.classList.toggle("dark-mode");
          localStorage.setItem("dark-mode", body.classList.contains("dark-mode"));
      });

      if (localStorage.getItem("dark-mode") === "true") {
          body.classList.add("dark-mode");
          themeSwitch.checked = true;
      }
  }

  /** ======== 🔐 API Functions (Login) ======== **/
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
                  console.log("✅ Login bem-sucedido!");
                  alert("Login realizado com sucesso!");

                  // Armazena o token e o nome do usuário no localStorage
                  localStorage.setItem("token", data.token);
                  localStorage.setItem("userName", data.user.name);

                  window.location.href = "/"; // Redireciona para a home
              } else {
                  console.warn("⚠️ Erro no login:", data.message);
                  alert(`Erro: ${data.message}`);
              }
          } catch (error) {
              console.error("❌ Erro ao conectar-se ao servidor:", error);
              alert("Erro ao conectar-se ao servidor.");
          }
      }
  };

  /** ======== 🔑 Ação de Login ======== **/
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
      loginForm.addEventListener("submit", function (event) {
          event.preventDefault();
          console.log("🔑 Tentando fazer login...");

          const email = loginForm.querySelector("input[type='email']").value.trim();
          const password = loginForm.querySelector("input[type='password']").value.trim();

          if (!email || !password) {
              alert("⚠️ Por favor, preencha todos os campos.");
              return;
          }

          api.login(email, password);
      });
  }

  /** ======== 👤 Exibir Nome do Usuário Logado ======== **/
  function showUserName() {
      const storedName = localStorage.getItem("userName");
      if (storedName && userNameDisplay) {
          userNameDisplay.textContent = `Bem-vindo, ${storedName}!`;
      }
  }

  showUserName(); // Chama a função para exibir o nome

  /** ======== 🚪 Logout do Usuário ======== **/
  if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
          localStorage.removeItem("token");
          localStorage.removeItem("userName");
          alert("Você saiu da conta!");
          window.location.href = "/login"; // Redireciona para a página de login
      });
  }

  /** ======== ⏳ Buscar Horários Disponíveis ======== **/
  const dateInput = document.getElementById("date-select");
  const serviceSelect = document.getElementById("service-select");
  const timeSelect = document.getElementById("time-select");
  const form = document.getElementById("public-scheduling-form");

  async function loadAvailableTimes() {
      const date = dateInput.value;
      const service = serviceSelect.value;

      if (!date || !service) return;

      try {
          const response = await fetch(`/api/horarios/disponiveis?date=${date}&service=${service}`);
          const availableTimes = await response.json();

          timeSelect.innerHTML = '<option value="">Selecione um horário</option>';
          availableTimes.forEach(time => {
              const option = document.createElement('option');
              option.value = time;
              option.textContent = time;
              timeSelect.appendChild(option);
          });
      } catch (error) {
          console.error("❌ Erro ao buscar horários:", error);
      }
  }

  if (dateInput && serviceSelect) {
      dateInput.addEventListener("change", loadAvailableTimes);
      serviceSelect.addEventListener("change", loadAvailableTimes);
  }

  /** ======== 📅 Envio do Formulário de Agendamento ======== **/
  if (form) {
      form.addEventListener("submit", async (event) => {
          event.preventDefault();

          const nome = form.querySelector("input[type='text']").value.trim();
          const email = form.querySelector("input[type='email']").value.trim();
          const telefone = form.querySelector("input[type='tel']").value.trim();
          const service = serviceSelect.value;
          const date = dateInput.value;
          const time = timeSelect.value;

          if (!nome || !email || !telefone || !service || !date || !time) {
              alert("⚠️ Preencha todos os campos antes de agendar.");
              return;
          }

          try {
              const response = await fetch("/api/agendamentos/public", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ nome, email, telefone, service, date, time }),
              });

              const result = await response.json();
              if (response.ok) {
                  alert("✅ Agendamento realizado com sucesso!");
                  form.reset();
              } else {
                  alert(result.message || "Erro ao agendar. Tente novamente.");
              }
          } catch (error) {
              console.error("❌ Erro ao enviar agendamento:", error);
              alert("Erro ao conectar com o servidor.");
          }
      });
  }
});
