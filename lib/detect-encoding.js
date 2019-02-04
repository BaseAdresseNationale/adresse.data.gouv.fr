import jschardet from 'jschardet-french'
import toBuffer from 'blob-to-buffer'

function detectEncoding(blob) {
  return new Promise((resolve, reject) => {
    toBuffer(blob, (err, buffer) => {
      if (err) {
        return reject(err)
      }

      resolve(jschardet.detect(buffer))
    })
  })
}

export default detectEncoding
