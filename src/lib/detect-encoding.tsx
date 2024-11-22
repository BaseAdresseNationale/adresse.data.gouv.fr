import chardet from 'chardet'
import toBuffer from 'blob-to-buffer'

function detectEncoding(blob: Blob) {
  return new Promise((resolve, reject) => {
    toBuffer(blob, (err: Error, buffer: Buffer) => {
      if (err) {
        return reject(err)
      }

      resolve(chardet.detect(buffer))
    })
  })
}

export default detectEncoding
