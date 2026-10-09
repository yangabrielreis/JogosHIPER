"""Torre de Hanói: regras no servidor (logica.py), estado na session."""
from flask import Blueprint, jsonify, render_template, request, session

from . import logica

bp = Blueprint(
    "hanoi", __name__,
    template_folder="templates",
    static_folder="static",
    static_url_path="/static",
)


def estado():
    if "hanoi" not in session:
        session["hanoi"] = logica.novo_jogo(3)
    return session["hanoi"]


def resposta(e, erro=None):
    return jsonify({**e, "venceu": logica.venceu(e),
                    "minimo": 2 ** e["n"] - 1, "erro": erro})


@bp.route("/")
def index():
    return render_template("hanoi.html")


@bp.route("/api/estado")
def api_estado():
    return resposta(estado())


@bp.route("/api/novo", methods=["POST"])
def api_novo():
    n = max(1, min(8, int(request.get_json().get("n", 3))))
    session["hanoi"] = logica.novo_jogo(n)
    return resposta(session["hanoi"])


@bp.route("/api/mover", methods=["POST"])
def api_mover():
    e = estado()
    dados = request.get_json()
    erro = logica.mover(e, int(dados["de"]), int(dados["para"]))
    session["hanoi"] = e
    return resposta(e, erro)


@bp.route("/api/solucao")
def api_solucao():
    return jsonify(logica.resolver(estado()["n"]))
