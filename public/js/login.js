document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const messageBox = document.getElementById("messageBox");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            // Limpa mensagens anteriores
            messageBox.className = "alert d-none";
            
            // Captura os valores do formulário
            const formData = new FormData(this);
            const email = formData.get("email").trim().toLowerCase();
            const senha = formData.get("senha");

            try {
                // Fazer a requisição para o servidor
                const response = await fetch("/api/auth/login", { // Ajustado o endpoint
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, senha })
                });

                const data = await response.json();

                // Mostra a mensagem
                messageBox.classList.remove("d-none");

                if (response.ok) {
                    messageBox.className = "alert alert-success";
                    messageBox.innerText = "Login realizado com sucesso!";

                    // Salva o token no localStorage
                    if (data.token) {
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('userData', JSON.stringify(data.user));
                    }

                    // Redirecionar para a página inicial após 1 segundo
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1000);
                } else {
                    messageBox.className = "alert alert-danger";
                    messageBox.innerText = data.message || "E-mail ou senha inválidos";
                }
            } catch (error) {
                console.error("Erro:", error);
                messageBox.className = "alert alert-danger";
                messageBox.innerText = "Erro ao conectar com o servidor. Tente novamente.";
                messageBox.classList.remove("d-none");
            }
        });
    }
});