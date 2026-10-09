# Jogos Flask: Cobrinha, Forca e Torre de Hanói

## Rodar
```
pip install -r requirements.txt
python app.py
```
Abra http://localhost:5000

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
