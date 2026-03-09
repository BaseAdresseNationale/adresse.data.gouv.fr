const NODE_ENV = process.env.NODE_ENV

let secureSetup = true
if (NODE_ENV !== 'production') {
  secureSetup = false
}
export default secureSetup
