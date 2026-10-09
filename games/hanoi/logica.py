"""Regras da Torre de Hanói, sem Flask."""


def novo_jogo(n):
    # cada pino é uma lista; o último elemento é o disco do topo
    return {"n": n, "pinos": [list(range(n, 0, -1)), [], []], "movimentos": 0}


def mover(estado, de, para):
    """Move o disco do topo. Devolve mensagem de erro, ou None se deu certo."""
    pinos = estado["pinos"]
    if de == para or de not in (0, 1, 2) or para not in (0, 1, 2):
        return "Movimento inválido."
    if not pinos[de]:
        return "Não há disco nesse pino."
    if pinos[para] and pinos[para][-1] < pinos[de][-1]:
        return "Não pode pôr disco maior sobre um menor!"
    pinos[para].append(pinos[de].pop())
    estado["movimentos"] += 1
    return None


def venceu(estado):
    return len(estado["pinos"][2]) == estado["n"]


def resolver(n, origem=0, destino=2, auxiliar=1):
    """A famosa recursão: devolve a lista de movimentos (de, para)."""
    if n == 0:
        return []
    return (resolver(n - 1, origem, auxiliar, destino)
            + [(origem, destino)]
            + resolver(n - 1, auxiliar, destino, origem))
