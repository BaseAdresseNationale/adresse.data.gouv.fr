// This function is called once when the application starts
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return
  }

  const [{ downloadContoursCommunes }, { downloadLastNewsletters }] = await Promise.all([
    import('./utils/contours-communes'),
    import('./utils/newsletters'),
  ])

  await downloadContoursCommunes()

  // Only download newsletters in production
  // to avoid slowing down the development environment
  if (process.env.NODE_ENV === 'production') {
    await downloadLastNewsletters()
  }
}
