import {useState, useCallback, useEffect} from 'react'

function useLoadData(map, sources, layers) {
  const [isFirstLoad, setIsFirstLoad] = useState(false)
  const [loadedSources, setLoadedSources] = useState([])
  const [loadedLayers, setLoadedLayers] = useState([])

  const addSource = source => {
    const {name, ...properties} = source
    map.addSource(name, properties)
  }

  const updateSource = (source, properties) => {
    const {data} = properties
    source.setData(data)
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
  }, [map, sources])

  const loadLayers = useCallback(() => {
    layers.forEach(layer => {
      if (!map.getLayer(layer.id)) {
        map.addLayer(layer)
      }
    })

    setLoadedLayers(layers)
  }, [map, layers])

  const removeUnuseSources = useCallback(() => {
    const prevSourceNames = loadedSources.map(({name}) => name)
    const sourceNames = sources.map(({name}) => name)

    prevSourceNames.forEach(sourceName => {
      if (!sourceNames.includes(sourceName)) {
        map.removeSource(sourceName)
      }
    })
  }, [map, sources, loadedSources])

  const removeUnuseLayers = useCallback(() => {
    const prevLayerNames = loadedLayers.map(({id}) => id)
    const layerNames = layers.map(({id}) => id)

    prevLayerNames.forEach(layerName => {
      if (!layerNames.includes(layerName)) {
        map.removeLayer(layerName)
      }
    })
  }, [map, layers, loadedLayers])

  const removeUnuseData = useCallback(() => {
    removeUnuseLayers()
    removeUnuseSources()
  })

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
    }
  }, [map, isFirstLoad, sources, layers, loadedSources, loadedLayers])

  useEffect(() => {
    if (isFirstLoad && sources && layers) {
      reloadData()
    }
  }, [isFirstLoad, sources, layers])

  useEffect(() => {
    if (map && !isFirstLoad) {
      map.once('load', () => {
        setIsFirstLoad(true)
      })
    }
  }, [map, isFirstLoad])

  return reloadData
}

export default useLoadData
