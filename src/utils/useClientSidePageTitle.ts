'use client'
import { useEffect } from 'react'

export default function useClientSidePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | Base Adresse Nationale`
  }, [title])
}
