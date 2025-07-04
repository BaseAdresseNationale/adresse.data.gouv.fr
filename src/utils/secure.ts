import { env } from 'next-runtime-env'
const NODE_ENV = env('NODE_ENV')

let secureSetup = true
if (NODE_ENV !== 'production') {
  secureSetup = false
}
export default secureSetup
