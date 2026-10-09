const teclado = document.getElementById("teclado");

// cria os botões A-Z
"abcdefghijklmnopqrstuvwxyz".split("").forEach(l => {
  const b = document.createElement("button");
  b.textContent = l.toUpperCase();
  b.dataset.letra = l;
  b.onclick = () => chamar("/forca/api/chutar", { letra: l });
  teclado.appendChild(b);
});

async function chamar(url, corpo) {
  const r = await fetch(url, {
    method: corpo === undefined ? "GET" : "POST",
    headers: { "Content-Type": "application/json" },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  });
  mostrar(await r.json());
}

function mostrar(s) {
  document.getElementById("palavra").textContent = s.mascara.join(" ").toUpperCase();
  document.getElementById("erros").textContent = s.erros;
  document.getElementById("max").textContent = s.max_erros;

  // mostra as partes do boneco conforme os erros
  for (let i = 1; i <= 6; i++)
    document.getElementById("p" + i).style.display = i <= s.erros ? "" : "none";

  const fim = s.ganhou || s.perdeu;
  teclado.querySelectorAll("button").forEach(b => {
    b.disabled = fim || s.letras.includes(b.dataset.letra);
  });

  const msg = document.getElementById("msg");
  if (s.ganhou) msg.textContent = "Você ganhou!";
  else if (s.perdeu) msg.textContent = `Você perdeu! A palavra era "${s.palavra.toUpperCase()}"`;
  else msg.textContent = "";
}

document.getElementById("novo").onclick = () => chamar("/forca/api/novo", {});
chamar("/forca/api/estado");
