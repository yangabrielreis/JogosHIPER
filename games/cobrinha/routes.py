"""Cobrinha: a lógica do jogo roda no navegador (JS, tempo real).
O Flask serve a página e guarda o recorde (em memória) via API."""
from flask import Blueprint, jsonify, render_template, request

bp = Blueprint(
    "cobrinha", __name__,
    template_folder="templates",
    static_folder="static",
    static_url_path="/static",   # fica em /cobrinha/static/...
)

recorde = {"valor": 0}


@bp.route("/")
def index():
    return render_template("cobrinha.html")


@bp.route("/api/recorde", methods=["GET", "POST"])
def api_recorde():
    if request.method == "POST":
        pontos = int(request.get_json().get("pontos", 0))
        recorde["valor"] = max(recorde["valor"], pontos)
    return jsonify(recorde)
