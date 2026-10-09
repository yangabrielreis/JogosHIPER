const TAM = 20;            // células por lado
const PX = 400 / TAM;      // pixels por célula
const tela = document.getElementById("tela");
const ctx = tela.getContext("2d");

let cobra, dir, proxDir, comida, pontos, timer, vivo;

function novoJogo() {
  cobra = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
  dir = proxDir = { x: 1, y: 0 };
  pontos = 0;
  vivo = true;
  document.getElementById("msg").textContent = "";
  document.getElementById("pontos").textContent = 0;
  sortearComida();
  clearInterval(timer);
  timer = setInterval(passo, 120);
  desenhar();
}

function sortearComida() {
  do {
    comida = { x: Math.floor(Math.random() * TAM), y: Math.floor(Math.random() * TAM) };
  } while (cobra.some(c => c.x === comida.x && c.y === comida.y));
}

function passo() {
  dir = proxDir;
  const cabeca = { x: cobra[0].x + dir.x, y: cobra[0].y + dir.y };

  const bateuParede = cabeca.x < 0 || cabeca.y < 0 || cabeca.x >= TAM || cabeca.y >= TAM;
  const bateuCorpo = cobra.some(c => c.x === cabeca.x && c.y === cabeca.y);
  if (bateuParede || bateuCorpo) return fimDeJogo();

  cobra.unshift(cabeca);
  if (cabeca.x === comida.x && cabeca.y === comida.y) {
    pontos++;
    document.getElementById("pontos").textContent = pontos;
    sortearComida();
  } else {
    cobra.pop();
  }
  desenhar();
}

function desenhar() {
  ctx.clearRect(0, 0, 400, 400);
  ctx.fillStyle = "#ff6b6b";
  ctx.fillRect(comida.x * PX + 2, comida.y * PX + 2, PX - 4, PX - 4);
  cobra.forEach((c, i) => {
    ctx.fillStyle = i === 0 ? "#69db7c" : "#37b24d";
    ctx.fillRect(c.x * PX + 1, c.y * PX + 1, PX - 2, PX - 2);
  });
}

async function fimDeJogo() {
  clearInterval(timer);
  vivo = false;
  document.getElementById("msg").textContent = `Fim de jogo! Pontos: ${pontos}`;
  // envia a pontuação ao servidor Flask, que mantém o recorde
  const r = await fetch("/cobrinha/api/recorde", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pontos }),
  });
  mostrarRecorde(await r.json());
}

function mostrarRecorde(d) {
  document.getElementById("recorde").textContent = d.valor;
}

document.addEventListener("keydown", e => {
  const mapa = {
    ArrowUp: [0, -1], w: [0, -1], ArrowDown: [0, 1], s: [0, 1],
    ArrowLeft: [-1, 0], a: [-1, 0], ArrowRight: [1, 0], d: [1, 0],
  };
  const m = mapa[e.key];
  if (!m) return;
  e.preventDefault();
  // impede inverter 180° (a cobra bateria nela mesma)
  if (m[0] !== -dir.x || m[1] !== -dir.y) proxDir = { x: m[0], y: m[1] };
});

document.getElementById("reiniciar").onclick = novoJogo;
fetch("/cobrinha/api/recorde").then(r => r.json()).then(mostrarRecorde);
novoJogo();
