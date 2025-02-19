document.addEventListener("DOMContentLoaded", () => {
    const cadastroForm = document.getElementById("cadastroForm");

    if (cadastroForm) {
        cadastroForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const nome = formData.get("nome");
            const endereco = formData.get("endereco");
            const telefone = formData.get("telefone");
            const email = formData.get("email");
            const senha = formData.get("senha");
            const confirmarSenha = formData.get("confirmar_senha");
            const messageBox = document.getElementById("messageBox");

            // ✅ Validação: Senhas devem coincidir antes de enviar
            if (senha !== confirmarSenha) {
                messageBox.className = "alert alert-danger";
                messageBox.innerText = "As senhas não coincidem!";
                messageBox.classList.remove("d-none");
                return;
            }

            try {
                const response = await fetch("/cadastro", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nome, endereco, telefone, email, senha })
                });

                const data = await response.json();

                if (response.ok) {
                    messageBox.className = "alert alert-success";
                    messageBox.innerText = data.message;

                    // ✅ Redirecionar para login após 2 segundos
                    setTimeout(() => window.location.href = "/login", 2000);
                } else {
                    messageBox.className = "alert alert-danger";
                    messageBox.innerText = data.message || "Erro ao cadastrar.";
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
