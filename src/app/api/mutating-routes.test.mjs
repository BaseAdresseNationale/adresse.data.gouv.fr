import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const API_DIR = fileURLToPath(new URL('.', import.meta.url))
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])
const GUARD_STATEMENTS = ['const rejection = rejectCrossSiteRequest(request)', 'if (rejection) return rejection']

const routeFiles = readdirSync(API_DIR, { recursive: true })
  .filter(path => /(^|[\\/])route\.tsx?$/.test(path))

const isExported = statement => ts.canHaveModifiers(statement)
  && (ts.getModifiers(statement) ?? []).some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)

const functionBody = node => node && (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) ? node.body : undefined

// Un handler réexporté (`export { handler as POST }`) n'a pas de corps ici : il échoue, le garde n'y est pas vérifiable.
function findMutatingHandlers(sourceFile) {
  const handlers = []
  for (const statement of sourceFile.statements) {
    if (ts.isFunctionDeclaration(statement) && isExported(statement) && MUTATING_METHODS.has(statement.name?.text)) {
      handlers.push({ name: statement.name.text, body: statement.body })
    }
    if (ts.isVariableStatement(statement) && isExported(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && MUTATING_METHODS.has(declaration.name.text)) {
          handlers.push({ name: declaration.name.text, body: functionBody(declaration.initializer) })
        }
      }
    }
    if (ts.isExportDeclaration(statement) && statement.exportClause && ts.isNamedExports(statement.exportClause)) {
      for (const element of statement.exportClause.elements) {
        if (MUTATING_METHODS.has(element.name.text)) handlers.push({ name: element.name.text, body: undefined })
      }
    }
  }
  return handlers
}

function startsWithGuard({ body, sourceFile }) {
  if (!body || !ts.isBlock(body)) return false
  return GUARD_STATEMENTS.every((text, index) => body.statements[index]?.getText(sourceFile) === text)
}

test('every mutating route handler starts with the cross-site guard', () => {
  assert.ok(routeFiles.length > 10, `routes trouvées : ${routeFiles.length}`)

  for (const path of routeFiles) {
    const sourceFile = ts.createSourceFile(path, readFileSync(join(API_DIR, path), 'utf8'), ts.ScriptTarget.Latest, true)
    for (const { name, body } of findMutatingHandlers(sourceFile)) {
      assert.ok(startsWithGuard({ body, sourceFile }), `${path} : ${name} ne commence pas par rejectCrossSiteRequest`)
    }
  }
})
