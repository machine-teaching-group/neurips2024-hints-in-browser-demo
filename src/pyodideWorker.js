// eslint-disable-next-line no-undef
importScripts('https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js')

function getPythonTestDriver({ code, tests, function_name }) {
  return `
from checkmate import Request, run_tests
import json


source = '''
${code}
'''

request = Request(source=source, tests=${tests}, function_name="${function_name}", check_timeout=False)
results = run_tests(request)
[result.dict() for result in results]
`
}

function levenshtein_distance({ code1, code2 }) {
  return `
import re
import pylev
import pygments
from pygments.lexers.python import PythonLexer


def remove_line_comments(program: str) -> str:
    return re.sub(r'(?m)^\\s*#.*\\n', '', program)


def program_to_essential_tokens(program: str, strip_chars="\\n\\r\\t\\f "):
    simplified_program_tokens = []

    if isinstance(program, float) or program is None or len(program) == 0:
        return [""]

    lines = program.split("\\n")
    meaningful_lines = [line for line in lines if line.strip(strip_chars) != ""]
    program_without_blank_lines = "\\n".join(meaningful_lines)

    lexer = PythonLexer()
    lex_output = list(lexer.get_tokens(program_without_blank_lines))
    is_start_of_line = True
    for component in lex_output:
        token_type, token_value = component
        if token_type == pygments.token.Whitespace and token_value == "\\n":
            is_start_of_line = True
            if len(simplified_program_tokens) == 0 or simplified_program_tokens[-1] != "\\n":
                simplified_program_tokens.append(token_value)
        elif not is_start_of_line and token_type == pygments.token.Text and re.match(r"^\\s+$", token_value):
            pass  # drop all unnecessary spaces (i.e. all space tokens after the first non-space token in every line)
        elif token_type in pygments.token.Comment.subtypes:
            pass  # drop all comments
        else:
            simplified_program_tokens.append(token_value)
            is_start_of_line = False

    while len(simplified_program_tokens) > 0 and simplified_program_tokens[-1].strip(strip_chars) == "":
        del simplified_program_tokens[-1]

    return simplified_program_tokens

source1 = '''
${code1}
'''
source2 = '''
${code2}
'''

tokens1 = program_to_essential_tokens(remove_line_comments(source1))
tokens2 = program_to_essential_tokens(remove_line_comments(source2))
pylev.levenshtein(tokens1, tokens2)
  `
}

async function loadPyodideAndPackages() {
  // eslint-disable-next-line no-undef
  self.pyodide = await loadPyodide()
  await self.pyodide.loadPackage([
    'pydantic',
    'pygments',
    '/checkmate-0.2.2-py3-none-any.whl',
    '/pylev-1.4.0-py2.py3-none-any.whl',
  ])
}
let pyodideReadyPromise = loadPyodideAndPackages()

self.onmessage = async (event) => {
  if (event.data.cmd === 'RUN') {
    const { code, tests, function_name } = event.data
    const escapedCode = code.replace(/'/g, "\\'")
    try {
      let driver = getPythonTestDriver({
        code: escapedCode,
        tests,
        function_name,
      })
      let result = await self.pyodide.runPythonAsync(driver)
      result = result.toJs()
      result = result.map((item) => Object.fromEntries(item))
      self.postMessage({ test_id: event.data.test_id, result })
    } catch (error) {
      self.postMessage({
        test_id: event.data.test_id,
        result: [{ type: 'timeout' }],
      })
    }
  } else if (event.data.cmd === 'LOAD') {
    await pyodideReadyPromise
    self.pyodide.setInterruptBuffer(event.data.interruptBuffer)
    self.postMessage({ loaded: true })
  } else if (event.data.cmd === 'DISTANCE') {
    const { code1, code2 } = event.data
    const escapedCode1 = code1.replace(/'/g, "\\'")
    const escapedCode2 = code2.replace(/'/g, "\\'")
    const distance = await self.pyodide.runPythonAsync(
      levenshtein_distance({ code1: escapedCode1, code2: escapedCode2 })
    )
    self.postMessage({ distance })
  }
}
