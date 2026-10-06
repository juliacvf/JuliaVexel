document.addEventListener("DOMContentLoaded", function () {
    const notebook = document.querySelector("#notebook");
    const botaoLigar = document.querySelector("#botao-ligar");
    const mensagem = document.querySelectorAll(
        ".cumprimento h1, .cumprimento h2"
    );

    if (notebook === null || botaoLigar === null) {
        return;
    }

    let temporizador;
    let temporizadorDigitacao;

    // Guarda os textos sem perder as cores dos spans.
    const partes = [];

    for (const elemento of mensagem) {
        const walker = document.createTreeWalker(
            elemento,
            NodeFilter.SHOW_TEXT
        );

        while (walker.nextNode()) {
            partes.push({
                no: walker.currentNode,
                texto: walker.currentNode.textContent
            });
        }
    }

    function restaurarMensagem() {
        clearTimeout(temporizadorDigitacao);

        for (const parte of partes) {
            parte.no.textContent = parte.texto;
        }
    }

    function iniciarDigitacao() {
        clearTimeout(temporizadorDigitacao);

        for (const parte of partes) {
            parte.no.textContent = "";
        }

        let indiceParte = 0;
        let indiceLetra = 0;

        function escreverLetra() {
            if (!notebook.classList.contains("ligado")) {
                return;
            }

            const parte = partes[indiceParte];
            indiceLetra++;

            parte.no.textContent = parte.texto.slice(0, indiceLetra);

            if (indiceLetra >= parte.texto.length) {
                indiceParte++;
                indiceLetra = 0;

                if (indiceParte >= partes.length) {
                    return;
                }
            }

            temporizadorDigitacao = setTimeout(escreverLetra, 8);
        }

        temporizadorDigitacao = setTimeout(escreverLetra, 100);
    }

    const estavaLigado =
        sessionStorage.getItem("notebookLigado") === "true";

    if (estavaLigado) {
        notebook.classList.add("ligado");

        botaoLigar.setAttribute("aria-pressed", "true");
        botaoLigar.setAttribute("aria-label", "Desligar notebook");
    }

    // Na abertura da página, a mensagem já está completa.
    // A digitação só acontece após desligar e ligar pelo botão.

    botaoLigar.addEventListener("click", function () {
        const estaLigado = notebook.classList.contains("ligado");

        clearTimeout(temporizador);

        if (estaLigado) {
            notebook.classList.remove("ligado");
            notebook.classList.remove("iniciando");

            restaurarMensagem();
            sessionStorage.setItem("notebookLigado", "false");

            botaoLigar.setAttribute("aria-pressed", "false");
            botaoLigar.setAttribute("aria-label", "Ligar notebook");
        } else {
            notebook.classList.add("ligado");
            notebook.classList.add("iniciando");

            iniciarDigitacao();
            sessionStorage.setItem("notebookLigado", "true");

            botaoLigar.setAttribute("aria-pressed", "true");
            botaoLigar.setAttribute("aria-label", "Desligar notebook");

            temporizador = setTimeout(function () {
                notebook.classList.remove("iniciando");
            }, 700);
        }
    });
});