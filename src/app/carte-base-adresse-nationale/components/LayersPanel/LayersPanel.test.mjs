import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { runInNewContext } from 'node:vm'
import * as react from 'react'
import * as jsxRuntime from 'react/jsx-runtime'
import { renderToStaticMarkup } from 'react-dom/server'
import ts from 'typescript'

function loadLayersPanel() {
  const { outputText } = ts.transpileModule(readFileSync(new URL('LayersPanel.tsx', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  })
  const stub = tag => props => react.createElement(tag, props)
  const imports = {
    'react': react,
    'react/jsx-runtime': jsxRuntime,
    'next/image': { __esModule: true, default: ({ width, height, ...props }) => react.createElement('img', props) },
    '@codegouvfr/react-dsfr/Tooltip': {
      Tooltip: ({ title, children }) => react.createElement(react.Fragment, null,
        children,
        react.createElement('span', { role: 'tooltip' }, title),
      ),
    },
    './LayersPanel.styles': {
      PanelSection: stub('section'),
      PanelHeader: stub('div'),
      PanelTitle: stub('h2'),
      PanelContent: stub('div'),
      LayerFieldset: stub('fieldset'),
      LayerLegend: stub('legend'),
      LayerGrid: stub('div'),
      LayerOption: stub('div'),
      LayerThumbnail: stub('span'),
      LayerHint: stub('span'),
      LayerInfoIcon: stub('span'),
    },
  }
  const exports = {}
  runInNewContext(outputText, {
    exports,
    require(name) {
      assert.ok(name in imports, 'Unexpected import: ' + name)
      return imports[name]
    },
  })
  return exports
}

const { default: LayersPanel } = loadLayersPanel()

const defaultProps = {
  id: 'layers-panel',
  mapStyle: 'ign-vector',
  isIGNMapStyleAccessible: true,
  displayLandRegister: false,
  displayRnbBuildings: false,
  onMapStyleChange: () => {},
  onLandRegisterChange: () => {},
  onRnbBuildingsChange: () => {},
  onClose: () => {},
}

function render(props) {
  return renderToStaticMarkup(react.createElement(LayersPanel, { ...defaultProps, ...props }))
}

function inputs(html) {
  return [...html.matchAll(/<input ([^>]*)\/?>/g)].map(([, attrs]) => ({
    type: attrs.match(/type="([^"]+)"/)?.[1],
    id: attrs.match(/id="([^"]+)"/)?.[1],
    name: attrs.match(/name="([^"]+)"/)?.[1],
    value: attrs.match(/value="([^"]+)"/)?.[1],
    checked: /\bchecked=""/.test(attrs),
    disabled: /\bdisabled=""/.test(attrs),
  }))
}

function labelText(html, id) {
  const match = html.match(new RegExp(`<label[^>]*for="${id}"[^>]*>(.*?)</label>`))
  return match?.[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function legendOf(html, inputId) {
  const fieldset = [...html.matchAll(/<fieldset aria-labelledby="([^"]+)">(.*?)<\/fieldset>/g)]
    .find(([, , content]) => content.includes(`id="${inputId}"`))
  return html.match(new RegExp(`<[a-z]+ id="${fieldset[1]}">(.*?)</`))[1]
}

// Rend le panneau et renvoie son arbre et les props de ses éléments du type demandé,
// pour appeler leurs handlers
function renderTree(props, type = 'input') {
  const found = []
  let tree
  function visit(node) {
    if (!react.isValidElement(node)) return
    if (node.type === type) found.push(node.props)
    react.Children.forEach(node.props.children, visit)
  }
  function Probe() {
    tree = LayersPanel({ ...defaultProps, ...props })
    visit(tree)
    return null
  }
  renderToStaticMarkup(react.createElement(Probe))
  return { tree, found }
}

function collectInputProps(props) {
  return renderTree(props).found
}

test('the panel is a region named "Couches" that the layers button can control', () => {
  const html = render({})
  const titleId = html.match(/<section id="layers-panel" aria-labelledby="([^"]+)">/)[1]
  assert.match(html, new RegExp(`<h2 id="${titleId}">Couches</h2>`))
})

test('the base maps are one radio group "Fonds de cartes" with the current style checked', () => {
  const html = render({ mapStyle: 'osm-vector' })
  const radios = inputs(html).filter(input => input.type === 'radio')
  assert.deepEqual(radios.map(radio => radio.value), ['ign-vector', 'osm-vector', 'ign-ortho'])
  assert.deepEqual(radios.map(radio => labelText(html, radio.id)), ['Plan (IGN)', 'Plan (OSM)', 'Vue satellite (IGN)'])
  assert.equal(new Set(radios.map(radio => radio.name)).size, 1)
  assert.deepEqual(radios.filter(radio => radio.checked).map(radio => radio.value), ['osm-vector'])
  assert.equal(legendOf(html, radios[0].id), 'Fonds de cartes')
})

test('the IGN base map is disabled with an explanation outside its coverage', () => {
  const available = inputs(render({ isIGNMapStyleAccessible: true })).find(input => input.value === 'ign-vector')
  assert.equal(available.disabled, false)

  const html = render({ isIGNMapStyleAccessible: false, mapStyle: 'osm-vector' })
  const radios = inputs(html).filter(input => input.type === 'radio')
  const ign = radios.find(radio => radio.value === 'ign-vector')
  assert.equal(labelText(html, ign.id), 'Plan (IGN) Non disponible sur ce territoire')
  assert.deepEqual(radios.filter(radio => radio.disabled).map(radio => radio.value), ['ign-vector'])
})

test('the other layers are labelled checkboxes "Autres couches" reflecting their display state', () => {
  for (const [displayLandRegister, displayRnbBuildings] of [[false, false], [true, false], [false, true], [true, true]]) {
    const html = render({ displayLandRegister, displayRnbBuildings })
    const checkboxes = inputs(html).filter(input => input.type === 'checkbox')
    assert.deepEqual(checkboxes.map(checkbox => labelText(html, checkbox.id)), ['Parcelles cadastrales', 'Bâtiments (RNB)'])
    assert.deepEqual(checkboxes.map(checkbox => checkbox.checked), [displayLandRegister, displayRnbBuildings])
    assert.equal(legendOf(html, checkboxes[0].id), 'Autres couches')
  }
})

test('the RNB layer is disabled and unchecked with an explanation outside its coverage', () => {
  const available = inputs(render({ displayRnbBuildings: true })).find(input => input.name === 'rnb-buildings')
  assert.equal(available.disabled, false)
  assert.equal(available.checked, true)

  const html = render({ displayRnbBuildings: true, isRnbLayerAccessible: false })
  const checkboxes = inputs(html).filter(input => input.type === 'checkbox')
  const rnb = checkboxes.find(checkbox => checkbox.name === 'rnb-buildings')
  assert.equal(labelText(html, rnb.id), 'Bâtiments (RNB) Non disponible sur ce territoire')
  assert.equal(rnb.checked, false)
  assert.deepEqual(checkboxes.filter(checkbox => checkbox.disabled).map(checkbox => checkbox.name), ['rnb-buildings'])
})

test('"Autres couches" has a focusable info icon explaining the zoom level', () => {
  const html = render({})
  const legend = html.match(/<legend>(.*?)<\/legend>/g).find(elt => elt.includes('Autres couches'))
  assert.match(legend, /<span class="ri-information-line" tabindex="0" aria-label="[^"]+"><\/span>/)
  assert.match(legend, /<span role="tooltip">[^<]*niveau de zoom[^<]*<\/span>/)
})

test('every layer shows a decorative thumbnail', () => {
  const html = render({})
  const images = [...html.matchAll(/<img ([^>]*)\/?>/g)].map(([, attrs]) => ({
    src: attrs.match(/src="([^"]+)"/)?.[1],
    alt: attrs.match(/alt="([^"]*)"/)?.[1],
  }))
  assert.equal(images.length, 5)
  assert.ok(images.every(image => image.src?.startsWith('/img/map/') && image.alt === ''))
})

test('choosing a base map or toggling a layer reports the new value', () => {
  const calls = []
  const found = collectInputProps({
    onMapStyleChange: style => calls.push(['style', style]),
    onLandRegisterChange: checked => calls.push(['cadastre', checked]),
    onRnbBuildingsChange: checked => calls.push(['rnb', checked]),
  })
  found.find(props => props.value === 'ign-ortho').onChange()
  found.find(props => props.name === 'land-register').onChange({ target: { checked: true } })
  found.find(props => props.name === 'rnb-buildings').onChange({ target: { checked: true } })
  assert.deepEqual(calls, [['style', 'ign-ortho'], ['cadastre', true], ['rnb', true]])
})

test('re-selecting the displayed base map records it when it differs from the saved choice', () => {
  const calls = []
  const props = { mapStyle: 'osm-vector', isIGNMapStyleAccessible: false, onMapStyleChange: style => calls.push(style) }

  // Hors couverture IGN : la carte affiche OSM mais le choix enregistré reste IGN
  let found = collectInputProps({ ...props, buttonMapStyle: 'ign-vector' })
  found.find(input => input.value === 'osm-vector').onClick()
  found.find(input => input.value === 'ign-ortho').onClick()
  assert.deepEqual(calls, ['osm-vector'])

  found = collectInputProps({ ...props, buttonMapStyle: 'osm-vector' })
  found.find(input => input.value === 'osm-vector').onClick()
  assert.deepEqual(calls, ['osm-vector'])
})

test('Escape and the close button close the panel', () => {
  let closed = 0
  const { tree, found: [closeButton] } = renderTree({ onClose: () => closed++ }, 'button')
  tree.props.onKeyDown({ key: 'Enter' })
  assert.equal(closed, 0)
  tree.props.onKeyDown({ key: 'Escape' })
  assert.equal(closed, 1)
  closeButton.onClick()
  assert.equal(closed, 2)

  assert.match(render({}), /<button type="button"[^>]*title="Fermer le panneau des couches"[^>]*>Fermer le panneau des couches<\/button>/)
})
