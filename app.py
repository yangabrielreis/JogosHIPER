"""Ponto de entrada: sobe os 3 jogos em um único site.

    python app.py

Cada jogo é um Blueprint independente em games/<jogo>/.
"""
from flask import Flask, render_template

from games.cobrinha import bp as cobrinha_bp
from games.forca import bp as forca_bp
from games.hanoi import bp as hanoi_bp

app = Flask(__name__)
app.secret_key = "troque-isto-em-producao"  # necessário para session (forca e hanoi)

app.register_blueprint(cobrinha_bp, url_prefix="/cobrinha")
app.register_blueprint(forca_bp, url_prefix="/forca")
app.register_blueprint(hanoi_bp, url_prefix="/hanoi")


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True, port=5000)
