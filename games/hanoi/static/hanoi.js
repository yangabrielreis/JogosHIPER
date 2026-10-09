const mesa = document.getElementById("mesa");
const msg = document.getElementById("msg");
let origem = null;
let ocupado = false;   // true enquanto a solução automática roda

const seletor = document.getElementById("n");
for (let i = 1; i <= 8; i++) seletor.add(new Option(i, i, false, i === 3));

async function api(url, corpo) {
  const r = await fetch(url, {
    method: corpo === undefined ? "GET" : "POST",
    headers: { "Content-Type": "application/json" },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  });
  return r.json();
}

function desenhar(e) {
  mesa.innerHTML = "";
  e.pinos.forEach((discos, i) => {
    const p = document.createElement("div");
    p.className = "pino" + (origem === i ? " sel" : "");
    p.onclick = () => clicar(i);
    discos.forEach(d => {
      const el = document.createElement("div");
      el.className = "disco";
      el.style.width = (20 + (d / e.n) * 80) + "%";
      el.style.background = `hsl(${(d * 360) / (e.n + 1)}, 70%, 55%)`;
      p.appendChild(el);
    });
    mesa.appendChild(p);
  });
  document.getElementById("mov").textContent = e.movimentos;
  document.getElementById("min").textContent = e.minimo;
  seletor.value = e.n;
  msg.textContent = e.erro || (e.venceu ? `Você venceu em ${e.movimentos} movimentos!` : "");
}

async function clicar(i) {
  if (ocupado) return;
  if (origem === null) { origem = i; return desenhar(await api("/hanoi/api/estado")); }
  const de = origem;
  origem = null;
  desenhar(await api("/hanoi/api/mover", { de, para: i }));
}

async function novo() {
  origem = null;
  desenhar(await api("/hanoi/api/novo", { n: +seletor.value }));
}

async function resolver() {
  if (ocupado) return;
  ocupado = true;
  await novo();                                   // recomeça do zero
  const passos = await api("/hanoi/api/solucao"); // lista de [de, para]
  for (const [de, para] of passos) {
    await new Promise(r => setTimeout(r, 500));
    desenhar(await api("/hanoi/api/mover", { de, para }));
  }
  ocupado = false;
}

document.getElementById("novo").onclick = () => { if (!ocupado) novo(); };
document.getElementById("resolver").onclick = resolver;
seletor.onchange = () => { if (!ocupado) novo(); };
api("/hanoi/api/estado").then(desenhar);
