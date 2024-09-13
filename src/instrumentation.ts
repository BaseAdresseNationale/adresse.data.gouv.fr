import { downloadContoursCommunes } from './utils/contours-communes'

// This function is called once when the application starts
export async function register() {
  await downloadContoursCommunes()
}
