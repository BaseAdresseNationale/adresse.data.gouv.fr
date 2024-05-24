export default async function handler(req, res) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_SIGNALEMENT}/signalements`,
      {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.SIGNALEMENT_SOURCE_TOKEN}`,
        },
        body: JSON.stringify(req.body),
      }
    )
    const data = await response.json()

    res.status(response.status).json(data)
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}
