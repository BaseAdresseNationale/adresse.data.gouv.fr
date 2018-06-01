export function isWebGLSupported() {
  try {
    const canvas = document.createElement('canvas')

    return Boolean(
      window.WebGLRenderingContext && (
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      )
    )
  } catch (err) {
    return false
  }
}

export default isWebGLSupported
