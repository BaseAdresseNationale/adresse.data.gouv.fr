import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { runInNewContext } from 'node:vm'
import { createElement, useEffect } from 'react'
import * as jsxRuntime from 'react/jsx-runtime'
import { renderToStaticMarkup } from 'react-dom/server'
import { styled, ThemeProvider } from 'styled-components'
import ts from 'typescript'

function load(file, imports) {
  const { outputText } = ts.transpileModule(readFileSync(new URL(file, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  })
  const exports = {}
  runInNewContext(outputText, {
    exports,
    require(name) {
      if (name === 'react/jsx-runtime') return jsxRuntime
      if (name === 'styled-components') return { __esModule: true, default: styled, ThemeProvider }
      assert.ok(name in imports, 'Unexpected import: ' + name)
      return imports[name]
    },
  })
  return exports
}

test('the global error document renders outside the root layout and its theme provider', () => {
  const styles = load('error-layout.styled.tsx', {})
  const ErrorLayout = load('error-layout.tsx', {
    'next/link': ({ children, href }) => createElement('a', { href }, children),
    '@/components/Section': ({ pageTitle, title, children, footer }) => createElement('section', null,
      createElement('h1', null, pageTitle), createElement('h2', null, title), children, footer),
    '@/components/ResponsiveImage': ({ src, alt }) => createElement('img', { src, alt }),
    './error-layout.styled': styles,
  }).default
  const GlobalError = load('global-error.tsx', {
    react: { useEffect },
    '@codegouvfr/react-dsfr/Button': { Button: ({ children, onClick }) => createElement('button', { onClick }, children) },
    './error-layout': ErrorLayout,
    '@/theme': { breakpoints: { md: '48em' } },
  }).default
  const html = renderToStaticMarkup(createElement(GlobalError, { error: new Error('Upstream failure'), reset() {} }))
  assert.ok(html.includes('<html lang="fr">'))
  assert.ok(html.includes('<body>'))
  assert.ok(html.includes('Erreur inattendue'))
  assert.ok(html.includes('Recharger la page'))
})
