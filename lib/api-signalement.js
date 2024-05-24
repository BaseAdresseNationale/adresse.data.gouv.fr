export async function sendSignalement(signalement) {
  const response = await fetch('/api/create-signalement', {
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

