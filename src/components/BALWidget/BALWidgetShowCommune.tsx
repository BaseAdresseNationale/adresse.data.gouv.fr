'use client'

import BALWidgetContext from "@/contexts/BALWidget.context"
import { useContext, useEffect, useState } from "react"

interface BALWidgetShowCommuneProps {
    codeCommune: string
    nomCommune: string
}

export function BALWidgetShowCommune({ codeCommune, nomCommune }: BALWidgetShowCommuneProps) {
    const [wasTriggered, setWasTriggered] = useState(false)
    const {open, navigate, isBalWidgetOpen, isBalWidgetReady} = useContext(BALWidgetContext)

    useEffect(() => {
        if (isBalWidgetReady && !isBalWidgetOpen && !wasTriggered) {
            open()
            navigate(`/commune/bal-status?code=${codeCommune}&nom=${nomCommune}`)
            setWasTriggered(true)
        }
    }, [open, navigate, isBalWidgetOpen, isBalWidgetReady])

  return null
}