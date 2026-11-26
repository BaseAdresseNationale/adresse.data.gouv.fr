import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

// Compiles a TypeScript module and runs it with the given imports: any other import fails the test.
export function loadTsModule({ url, imports = {}, globals = {} }) {
  const { outputText } = ts.transpileModule(readFileSync(url, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  })
  const exports = {}
  runInNewContext(outputText, {
    exports,
    require(name) {
      if (!Object.hasOwn(imports, name)) throw new Error(`Unexpected import: ${name}`)
      return imports[name]
    },
    URL,
    URLSearchParams,
    Response,
    Headers,
    console,
    ...globals,
  })
  return exports
}
