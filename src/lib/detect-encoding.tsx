import chardet from 'chardet'
import toBuffer from 'blob-to-buffer'

function detectEncoding(blob) {
  return new Promise((resolve, reject) => {
    toBuffer(blob, (err, buffer) => {
      if (err) {
        return reject(err)
      }

      resolve(chardet.detect(buffer))
    })
  })
}

export default detectEncoding
