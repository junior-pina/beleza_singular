document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const messageBox = document.getElementById("messageBox");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault(); // Impede o reload da página ao enviar o formulário

            // Capturar os valores do formulário
            const formData = new FormData(this);
            const email = formData.get("email").trim().toLowerCase(); // 🔥 Converter email para minúsculas
            const senha = formData.get("senha");

            try {
                // Fazer a requisição para o servidor
                const response = await fetch("/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, senha })
                });

                const data = await response.json();

                if (response.ok) {
                    messageBox.className = "alert alert-success";
                    messageBox.innerText = data.message;

                    // Redirecionar para a página inicial após 2 segundos
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 2000);
                } else {
                    messageBox.className = "alert alert-danger";
                    messageBox.innerText = data.message || "Erro ao fazer login.";
                }

                messageBox.classList.remove("d-none");

            } catch (error) {
                console.error("Erro:", error);
                messageBox.className = "alert alert-danger";
                messageBox.innerText = "Erro no servidor. Tente novamente.";
                messageBox.classList.remove("d-none");
            }
        });
    }
});
