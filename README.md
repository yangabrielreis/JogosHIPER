# Jogos Flask: Cobrinha, Forca e Torre de Hanói

## Rodar

Crie e ative o ambiente virtual (só na primeira vez o `python -m venv`):

```
python -m venv .venv
source .venv/bin/activate        # Linux/Mac
.venv\Scripts\activate           # Windows (cmd/PowerShell)
```

Instale as dependências e suba o site:

```
pip install -r requirements.txt
python app.py
```
Abra http://localhost:5000

Para sair do venv: `deactivate`.

## Estrutura
```
app.py                  # junta os 3 jogos (register_blueprint)
templates/              # base.html + página inicial
static/style.css
games/
  cobrinha/  routes.py  templates/  static/cobrinha.js   # lógica em JS, Flask guarda recorde
  forca/     logica.py  routes.py   templates/  static/  # regras em Python, estado na session
  hanoi/     logica.py  routes.py   templates/  static/  # regras + solução recursiva em Python
```
