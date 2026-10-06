document.addEventListener("DOMContentLoaded", function () {
    const notebook = document.querySelector("#notebook");
    const botaoLigar = document.querySelector("#botao-ligar");

    if (notebook === null || botaoLigar === null) {
        return;
    }

    let temporizador;

    const estavaLigado =
        sessionStorage.getItem("notebookLigado") === "true";

    if (estavaLigado) {
        notebook.classList.add("ligado");

        botaoLigar.setAttribute("aria-pressed", "true");
        botaoLigar.setAttribute("aria-label", "Desligar notebook");
    }

    botaoLigar.addEventListener("click", function () {
        const estaLigado =
            notebook.classList.contains("ligado");

        clearTimeout(temporizador);

        if (estaLigado) {
            notebook.classList.remove("ligado");
            notebook.classList.remove("iniciando");

            sessionStorage.setItem("notebookLigado", "false");

            botaoLigar.setAttribute("aria-pressed", "false");
            botaoLigar.setAttribute("aria-label", "Ligar notebook");
        } else {
            notebook.classList.add("ligado");
            notebook.classList.add("iniciando");

            sessionStorage.setItem("notebookLigado", "true");

            botaoLigar.setAttribute("aria-pressed", "true");
            botaoLigar.setAttribute("aria-label", "Desligar notebook");

            temporizador = setTimeout(function () {
                notebook.classList.remove("iniciando");
            }, 700);
        }
    });
});