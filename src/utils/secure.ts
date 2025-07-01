import { env } from 'next-runtime-env'
const NODE_ENV = env('NODE_ENV')

let secureSetup = true
if (NODE_ENV !== 'production' && NODE_ENV !== 'staging' && NODE_ENV !== 'mutualised') {
  secureSetup = false
}
export default secureSetup
