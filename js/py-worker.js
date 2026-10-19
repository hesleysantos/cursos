// Executa Python (Pyodide) fora da thread principal, para a página não travar
// com laços infinitos. A thread principal mata o worker se passar do tempo.
// É um "module worker": criado com new Worker(url, { type: 'module' }).
import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.mjs';

const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v314.0.7/full/';

const ready = loadPyodide({ indexURL: PYODIDE_URL }).then(py => {
  py.runPython(`
import sys, io, traceback, json, ast, asyncio, linecache

async def __executar(codigo, testes):
    # Permite inspect.getsource() funcionar sobre o código do aluno.
    linecache.cache["seu_codigo.py"] = (len(codigo), None, codigo.splitlines(True), "seu_codigo.py")
    buf = io.StringIO()
    antigo = sys.stdout
    sys.stdout = buf
    ns = {"__name__": "__main__"}
    resultado = {"ok": False, "saida": "", "erro": None, "fase": "codigo"}
    try:
        exec(compile(codigo, "seu_codigo.py", "exec"), ns)
        resultado["fase"] = "testes"
        ns["saida"] = buf.getvalue()
        if testes:
            # Testes podem usar "await" no nível superior (exercícios de asyncio).
            co = compile(testes, "testes.py", "exec", flags=ast.PyCF_ALLOW_TOP_LEVEL_AWAIT)
            r = eval(co, ns)
            if asyncio.iscoroutine(r):
                await r
        resultado["ok"] = True
    except AssertionError as e:
        resultado["erro"] = str(e) or "Um teste falhou (assert sem mensagem)."
    except SystemExit:
        resultado["ok"] = resultado["fase"] == "testes"
    except BaseException as e:
        tb = traceback.extract_tb(e.__traceback__)
        linhas = [f for f in tb if f.filename in ("seu_codigo.py", "testes.py")]
        onde = f" (linha {linhas[-1].lineno})" if linhas else ""
        resultado["erro"] = f"{type(e).__name__}: {e}{onde}"
    finally:
        sys.stdout = antigo
        resultado["saida"] = buf.getvalue()
    return json.dumps(resultado)
`);
  return py;
});

self.onmessage = async (ev) => {
  const { id, code, tests } = ev.data;
  try {
    const py = await ready;
    const fn = py.globals.get('__executar');
    const json = await fn(code, tests || '');
    fn.destroy && fn.destroy();
    self.postMessage({ id, result: JSON.parse(json) });
  } catch (e) {
    self.postMessage({ id, result: { ok: false, saida: '', erro: 'Falha ao iniciar o Python no navegador: ' + (e && e.message ? e.message : e) } });
  }
};

ready.then(() => self.postMessage({ ready: true }), e => self.postMessage({ ready: false, error: String(e) }));
