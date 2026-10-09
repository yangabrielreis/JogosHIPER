"""Forca: a lógica fica no servidor (logica.py); o estado vai na session."""
from flask import Blueprint, jsonify, render_template, request, session

from . import logica

bp = Blueprint(
    "forca", __name__,
    template_folder="templates",
    static_folder="static",
    static_url_path="/static",
)


def estado():
    if "forca" not in session:
        session["forca"] = logica.novo_jogo()
    return session["forca"]


@bp.route("/")
def index():
    return render_template("forca.html")


@bp.route("/api/estado")
def api_estado():
    return jsonify(logica.situacao(estado()))


@bp.route("/api/novo", methods=["POST"])
def api_novo():
    session["forca"] = logica.novo_jogo()
    return jsonify(logica.situacao(session["forca"]))


@bp.route("/api/chutar", methods=["POST"])
def api_chutar():
    e = estado()
    s = logica.situacao(e)
    if not (s["ganhou"] or s["perdeu"]):
        logica.chutar(e, request.get_json().get("letra", ""))
        session["forca"] = e          # reatribui para a session salvar
    return jsonify(logica.situacao(e))
