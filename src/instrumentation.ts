import { downloadLastNewsletters } from './utils/newsletters'
import { downloadContoursCommunes } from './utils/contours-communes'
import { env } from 'next-runtime-env'

// This function is called once when the application starts
export async function register() {
  await downloadContoursCommunes()
  // Only download newsletters in production
  // to avoid slowing down the development environment
  if (env('NODE_ENV') === 'production') {
    await downloadLastNewsletters()
  }
}
