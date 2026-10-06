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

    // Guarda os textos separadamente para manter as cores de "Julia",
    // "meu" e "portfólio".
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

            temporizadorDigitacao = setTimeout(escreverLetra, 12);
        }

        temporizadorDigitacao = setTimeout(escreverLetra, 250);
    }

    const estavaLigado =
        sessionStorage.getItem("notebookLigado") === "true";

    if (estavaLigado) {
        notebook.classList.add("ligado");

        botaoLigar.setAttribute("aria-pressed", "true");
        botaoLigar.setAttribute("aria-label", "Desligar notebook");
    }

    // Ao abrir a página, a mensagem permanece completa.
    // A digitação só começa quando o botão é usado para ligar a tela.

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