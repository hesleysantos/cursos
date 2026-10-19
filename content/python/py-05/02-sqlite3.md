# Bancos de dados com sqlite3

Nesta lição você vai aprender a guardar dados em um banco relacional de verdade, sem instalar nada: o SQLite vem embutido no Python pelo módulo `sqlite3`. Você verá como criar tabelas, inserir, consultar, alterar e apagar registros com SQL, como usar parâmetros para evitar SQL injection, como transações protegem seus dados e como modelar um cadastro simples de clientes e lançamentos contábeis.

## Por que um banco e não um CSV?

CSV e JSON são ótimos para trocar dados, mas sofrem quando o volume cresce ou quando várias informações se relacionam. Imagine 200 clientes e 50 mil lançamentos: para achar os lançamentos de um cliente em CSV você lê o arquivo inteiro; para garantir que todo lançamento aponta para um cliente existente, você escreve essa checagem na mão; se o programa cair no meio de uma gravação, o arquivo fica corrompido.

Um **banco relacional** resolve isso: tabelas com colunas tipadas, **índices** para busca rápida, **chaves estrangeiras** ligando tabelas e **transações** que garantem "ou grava tudo, ou nada". O SQLite guarda tudo em um único arquivo `.db` e é usado em celulares, navegadores e milhares de aplicativos. Para um sistema de escritório de porte pequeno a médio, ele é mais que suficiente.

## Conectar e criar tabelas

```python
import sqlite3

con = sqlite3.connect("escritorio.db")   # cria o arquivo se não existir
cur = con.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cnpj TEXT UNIQUE,
    regime TEXT CHECK (regime IN ('Simples', 'Presumido', 'Real'))
)
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS lancamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id),
    data TEXT NOT NULL,          -- ISO: 2026-03-31
    historico TEXT NOT NULL,
    valor REAL NOT NULL
)
""")
con.commit()
con.close()
```

Use `":memory:"` no lugar do nome do arquivo para um banco temporário na memória RAM, ideal para testes e para os exercícios desta lição.

Tipos do SQLite são poucos: `INTEGER`, `REAL`, `TEXT`, `BLOB`, `NULL`. Datas são guardadas como texto ISO (`AAAA-MM-DD`), que ordena corretamente como string. Valores monetários em `REAL` sofrem com ponto flutuante; em sistemas sérios, guarde **centavos em INTEGER** ou texto convertido com `Decimal`.

## Inserir com parâmetros

Nunca monte SQL concatenando strings. Use o marcador `?` e passe os valores em uma tupla. O driver faz o escape correto e o banco entende exatamente onde estão os dados.

```python
import sqlite3

con = sqlite3.connect(":memory:")
cur = con.cursor()
cur.execute("CREATE TABLE clientes (id INTEGER PRIMARY KEY, nome TEXT, cnpj TEXT UNIQUE)")

cur.execute("INSERT INTO clientes (nome, cnpj) VALUES (?, ?)", ("Padaria Pão Quente", "11222333000181"))
print(cur.lastrowid)   # 1  -> id gerado

varios = [
    ("Oficina do Zé", "22333444000172"),
    ("Mercado Bom Preço", "33444555000163"),
]
cur.executemany("INSERT INTO clientes (nome, cnpj) VALUES (?, ?)", varios)
con.commit()
print(cur.rowcount)    # 2  -> linhas afetadas pelo último comando
```

`executemany` insere uma lista inteira de uma vez e é muito mais rápido que um `execute` por linha dentro de um `for`.

### O perigo da concatenação: SQL injection

Veja o que acontece quando o nome vem de um formulário e você concatena:

```python
nome = "x'); DROP TABLE clientes; --"
sql = f"INSERT INTO clientes (nome) VALUES ('{nome}')"
print(sql)
# INSERT INTO clientes (nome) VALUES ('x'); DROP TABLE clientes; --')
```

Um usuário mal-intencionado (ou um apóstrofo inocente em "D'Avila") quebra ou destrói seu banco. Com `?`, a string inteira vira um valor e nada mais: `cur.execute("INSERT INTO clientes (nome) VALUES (?)", (nome,))` grava literalmente o texto estranho, sem executar nada. **Essa é a regra número um de segurança em banco de dados.**

## Consultar

Os blocos desta seção e das seguintes **continuam a sessão anterior**: mesma conexão `con`, mesmo cursor `cur` e os três clientes já inseridos (por isso não repetem o `import` nem o `connect`). Onde aparece `lancamentos`, suponha que a tabela da primeira seção foi criada nessa mesma conexão e recebeu alguns lançamentos.

```python
cur.execute("SELECT id, nome FROM clientes WHERE nome LIKE ? ORDER BY nome", ("%o%",))
for linha in cur.fetchall():
    print(linha)
# (3, 'Mercado Bom Preço')
# (2, 'Oficina do Zé')
# (1, 'Padaria Pão Quente')

cur.execute("SELECT COUNT(*) FROM clientes")
print(cur.fetchone()[0])   # 3
```

`fetchone()` devolve uma linha (ou `None`), `fetchall()` devolve lista de tuplas, e o próprio cursor é iterável. Por padrão as linhas são tuplas; para acessar por nome de coluna, configure `con.row_factory = sqlite3.Row`:

```python
con.row_factory = sqlite3.Row
cur = con.cursor()
cur.execute("SELECT * FROM clientes WHERE id = ?", (1,))
c = cur.fetchone()
print(c["nome"], c["cnpj"])   # Padaria Pão Quente 11222333000181
print(dict(c))                # {'id': 1, 'nome': 'Padaria Pão Quente', 'cnpj': '11222333000181'}
```

### Agregações e junções

Aqui o SQL brilha. Com a tabela `lancamentos` preenchida, totalizar lançamentos por cliente é uma única consulta (repare que o SQLite aceita o apelido `total` no `HAVING` e no `ORDER BY`):

```python
cur.execute("""
SELECT c.nome, COUNT(l.id) AS qtd, ROUND(SUM(l.valor), 2) AS total
FROM clientes c
JOIN lancamentos l ON l.cliente_id = c.id
WHERE l.data BETWEEN ? AND ?
GROUP BY c.id
HAVING total > 0
ORDER BY total DESC
""", ("2026-03-01", "2026-03-31"))
for nome, qtd, total in cur:
    print(f"{nome:<22} {qtd:>3} {total:>12,.2f}")
```

Em Python puro isso seria um `defaultdict`, dois loops e um `sorted`. O banco faz tudo isso, otimizado, e ainda usa índice se você criar um: `CREATE INDEX idx_lanc_data ON lancamentos(data)`.

## Alterar e apagar

```python
cur.execute("UPDATE clientes SET nome = ? WHERE id = ?", ("Padaria Pão Quente Ltda", 1))
print(cur.rowcount)   # 1

cur.execute("DELETE FROM lancamentos WHERE cliente_id = ? AND data < ?", (1, "2025-01-01"))
con.commit()
```

> **Atenção:** um `UPDATE` ou `DELETE` **sem `WHERE`** afeta a tabela inteira. Antes de rodar em produção, teste a mesma condição com um `SELECT COUNT(*)`.

## Transações e context manager

Por padrão, `sqlite3` abre uma transação implícita antes de comandos que alteram dados e só grava quando você chama `con.commit()`. Se der erro no meio, `con.rollback()` desfaz tudo desde o último commit. Isso é o que garante que uma transferência entre contas não fique "pela metade".

A conexão funciona como gerenciador de contexto: o bloco `with con:` faz commit se tudo der certo e rollback se uma exceção escapar. Repare que **ele não fecha a conexão**; feche com `con.close()` ou use `contextlib.closing`.

```python
import sqlite3
from contextlib import closing

def transferir(con, origem_id, destino_id, valor, data):
    with con:   # commit no fim, rollback se falhar
        con.execute(
            "INSERT INTO lancamentos (cliente_id, data, historico, valor) VALUES (?, ?, ?, ?)",
            (origem_id, data, "Transferência enviada", -valor),
        )
        con.execute(
            "INSERT INTO lancamentos (cliente_id, data, historico, valor) VALUES (?, ?, ?, ?)",
            (destino_id, data, "Transferência recebida", valor),
        )

with closing(sqlite3.connect(":memory:")) as con:
    con.execute("CREATE TABLE clientes (id INTEGER PRIMARY KEY, nome TEXT)")
    con.execute("CREATE TABLE lancamentos (id INTEGER PRIMARY KEY, cliente_id INTEGER, data TEXT, historico TEXT, valor REAL)")
    con.execute("INSERT INTO clientes (nome) VALUES ('A'), ('B')")
    transferir(con, 1, 2, 500.0, "2026-03-10")
    total = con.execute("SELECT SUM(valor) FROM lancamentos").fetchone()[0]
    print(total)   # 0.0  -> partidas dobradas: soma zero
```

Note que `con.execute(...)` cria um cursor implícito; para comandos rápidos isso evita o `cur = con.cursor()`.

Chaves estrangeiras **não são verificadas por padrão** no SQLite. Ative com `con.execute("PRAGMA foreign_keys = ON")` logo depois de conectar, ou um lançamento poderá apontar para um cliente que não existe.

## Modelagem simples

Para o nosso escritório, três tabelas resolvem muito:

```sql
CREATE TABLE clientes   (id INTEGER PRIMARY KEY, nome TEXT NOT NULL, cnpj TEXT UNIQUE);
CREATE TABLE contas     (codigo TEXT PRIMARY KEY, descricao TEXT NOT NULL, tipo TEXT);
CREATE TABLE lancamentos(
    id INTEGER PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id),
    conta TEXT NOT NULL REFERENCES contas(codigo),
    data TEXT NOT NULL,
    historico TEXT,
    valor_centavos INTEGER NOT NULL
);
```

Regras de bolso: cada tabela representa uma coisa; use chave primária inteira; evite repetir dados (o nome do cliente fica em `clientes`, não em cada lançamento); crie índice nas colunas por onde você filtra com frequência.

## Armadilhas comuns

- **Esquecer `commit()`.** Você insere, fecha e os dados somem. Use `with con:` para não esquecer.
- **Concatenar SQL.** Sempre `?`. Isso vale também para o `LIKE`: passe `f"%{termo}%"` como parâmetro.
- **Usar `REAL` para dinheiro** sem perceber arredondamentos. Prefira centavos inteiros.
- **Deixar a conexão aberta** em scripts longos ou múltiplas threads. Uma conexão por thread, feche no fim.
- **Guardar datas em `DD/MM/AAAA`.** Não ordena nem compara. Use ISO `AAAA-MM-DD`.
- **Ignorar `PRAGMA foreign_keys`.** Sem ele, as referências não são conferidas.

## Na prática

O uso mais comum no escritório é o **histórico local**: cada robô que baixa dados (extratos, notas, lançamentos de uma API) grava uma cópia em um `.db` antes de gerar qualquer relatório. Com isso, o relatório do mês passado pode ser refeito sem baixar nada, uma auditoria vira um `SELECT` e a comparação entre competências é um `GROUP BY` por mês. Abra o arquivo com o DB Browser for SQLite (gratuito) para inspecionar as tabelas sem escrever código.

## Resumo

- `sqlite3` vem com o Python; `connect("arquivo.db")` ou `connect(":memory:")`.
- CRUD é SQL: `CREATE TABLE`, `INSERT`, `SELECT ... WHERE/GROUP BY/ORDER BY`, `UPDATE`, `DELETE`.
- **Sempre** use parâmetros `?`; concatenar strings abre a porta para SQL injection.
- `commit()` grava, `rollback()` desfaz; `with con:` faz isso automaticamente, mas não fecha a conexão.
- Modele com uma tabela por entidade, chaves inteiras, datas ISO e dinheiro em centavos.
