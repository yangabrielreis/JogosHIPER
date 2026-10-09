"""Regras da forca, sem nada de Flask (fácil de explicar e testar)."""
import random
import unicodedata

PALAVRAS = [
    "python", "computador", "algoritmo", "variavel", "funcao", "teclado",
    "internet", "programa", "servidor", "navegador", "recursao", "banco",
    "arquivo", "biblioteca", "processador", "memoria", "compilador", "hanoi",
]
MAX_ERROS = 6


def sem_acento(texto):
    return "".join(c for c in unicodedata.normalize("NFD", texto)
                   if unicodedata.category(c) != "Mn")


def novo_jogo():
    return {"palavra": random.choice(PALAVRAS), "letras": [], "erros": 0}


def chutar(estado, letra):
    letra = sem_acento(letra.lower())
    if len(letra) != 1 or not letra.isalpha() or letra in estado["letras"]:
        return
    estado["letras"].append(letra)
    if letra not in estado["palavra"]:
        estado["erros"] += 1


def situacao(estado):
    """Devolve o que o navegador pode ver (sem revelar a palavra antes do fim)."""
    mascara = [l if l in estado["letras"] else "_" for l in estado["palavra"]]
    ganhou = "_" not in mascara
    perdeu = estado["erros"] >= MAX_ERROS
    return {
        "mascara": mascara,
        "letras": estado["letras"],
        "erros": estado["erros"],
        "max_erros": MAX_ERROS,
        "ganhou": ganhou,
        "perdeu": perdeu,
        "palavra": estado["palavra"] if (ganhou or perdeu) else None,
    }
