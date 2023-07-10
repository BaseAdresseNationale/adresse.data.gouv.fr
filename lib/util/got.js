const got = require('got')
const {HttpsProxyAgent} = require('hpagent')

const PROXY_URL = process.env.PROXY_URL || ''

const gotWithProxy = async (url, options) => {
  if (PROXY_URL) {
    const agent = {
      https: new HttpsProxyAgent({proxy: PROXY_URL})
    }
    return got(url, {...options, agent})
  }

  return got(url, options)
}

module.exports = gotWithProxy
