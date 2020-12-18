import {useState, useCallback, useEffect} from 'react'

function useLoadData(map, isFirstLoad, sources, layers) {
  const [loadedSources, setLoadedSources] = useState([])
  const [loadedLayers, setLoadedLayers] = useState([])

  const addSource = useCallback(source => {
    const {name, ...properties} = source
    map.addSource(name, properties)
  }, [map])

  const updateSource = (source, properties) => {
    const {data} = properties
    if (data) {
      source.setData(data)
    }
  }

  const loadSources = useCallback(() => {
    sources.forEach(({name, ...properties}) => {
      const source = map.getSource(name)

      if (source) {
        updateSource(source, properties)
      } else {
        addSource({name, ...properties})
      }
    })

    setLoadedSources(sources)
  }, [addSource, map, sources])

  const loadLayers = useCallback(() => {
    layers.forEach(layer => {
      if (!map.getLayer(layer.id)) {
        map.addLayer(layer)
      }
    })

    setLoadedLayers(layers)
  }, [map, layers])

  const removeUnuseSources = useCallback(() => {
    const previousSourceNames = loadedSources.map(({name}) => name)
    const sourceNames = new Set(sources.map(({name}) => name))

    previousSourceNames.forEach(sourceName => {
      if (!sourceNames.has(sourceName)) {
        map.removeSource(sourceName)
      }
    })
  }, [map, sources, loadedSources])

  const removeUnuseLayers = useCallback(() => {
    const previousLayerNames = loadedLayers.map(({id}) => id)
    const layerNames = new Set(layers.map(({id}) => id))

    previousLayerNames.forEach(layerName => {
      if (!layerNames.has(layerName)) {
        map.removeLayer(layerName)
      }
    })
  }, [map, layers, loadedLayers])

  const removeUnuseData = useCallback(() => {
    removeUnuseLayers()
    removeUnuseSources()
  }, [removeUnuseLayers, removeUnuseSources])

  const reloadData = useCallback(() => {
    if (map && isFirstLoad && sources && layers) {
      if (layers.length < loadedLayers.length &&
        sources.length < loadedSources.length) {
        removeUnuseData()
      }

      if (sources.length > 0) {
        loadSources()
      }

      if (layers.length > 0) {
        loadLayers()
      }

      map.resize()
    }
  }, [map, isFirstLoad, sources, layers, loadedLayers.length, loadedSources.length, removeUnuseData, loadSources, loadLayers])

  useEffect(() => {
    if (sources && layers) {
      reloadData()
    }
  }, [sources, layers, reloadData])

  return [reloadData, loadedLayers]
}

export default useLoadData
