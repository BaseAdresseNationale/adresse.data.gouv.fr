export class CustomControlGroup {
  constructor(childs) {
    this._container = document.createElement('div')
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group'

    childs.forEach(child => {
      const container = child.getContainer()
      this._container.appendChild(container)
    })
  }

  onAdd(map) {
    this._map = map

    return this._container
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container)
    this._map = undefined
  }
}

export class CustomControlWrapper {
  constructor(action) {
    this._container = document.createElement('div')
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group'

    this._wrapButton = new CustomControl('➕', action)
    this._container.appendChild(this._wrapButton.getContainer())
  }

  onAdd(map) {
    this._map = map

    return this._container
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container)
    this._map = undefined
  }

  addChilds(childs) {
    childs.forEach(child => {
      const container = child.getContainer()
      this._container.appendChild(container)
    })
  }

  removeChilds() {
    const {children} = this._container

    for (let index = 0; index < children.length + 1; index++) {
      this._container.removeChild(children[1])
    }
  }
}

export class CustomControl {
  constructor(icon, action, active) {
    this._container = document.createElement('button')
    this._container.className = `mapboxgl-ctrl ctrl-custom ${active ? 'active' : ''}`
    this._container.addEventListener('click', e => action(e))

    if (icon.includes('/')) {
      this._container.innerHTML = `<img src='${icon}' style="margin: 5px; max-width: 20px;" />`
    } else {
      this._container.textContent = icon
    }
  }

  onAdd(map) {
    this._map = map

    return this._container
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container)
    this._map = undefined
  }

  getContainer() {
    return this._container
  }
}
