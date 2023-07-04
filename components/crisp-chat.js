import {useEffect} from 'react'
import {Crisp} from 'crisp-sdk-web'

function CrispChat() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID) {
      Crisp.configure(process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID)
    }
  }, [])

  return null
}

export default CrispChat
