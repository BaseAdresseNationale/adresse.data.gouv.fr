export async function sendSignalement(signalement) {
  const request = `${process.env.NEXT_PUBLIC_API_SIGNALEMENT}/signalements`

  const response = await fetch(request, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(signalement)
  })

  if (!response.ok) {
    throw new Error('Error while sending signalement')
  }

  return response.json()
}

