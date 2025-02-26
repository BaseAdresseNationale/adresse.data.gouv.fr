const { setGlobalDispatcher, fetch, EnvHttpProxyAgent } = require('undici')
const envHttpProxyAgent = new EnvHttpProxyAgent()
setGlobalDispatcher(envHttpProxyAgent)
