'use client'

import { createContext, useContext, useState } from 'react'

type TypeLayout = 'default' | 'small' | 'full-screen'

interface DefaultMainLayout {
  typeLayout: TypeLayout
  setTypeLayout: (v: TypeLayout) => void
}

const defaultMainLayout: DefaultMainLayout = {
  typeLayout: 'default',
  setTypeLayout: (v: TypeLayout) => void v,
}

const LayoutContext = createContext(defaultMainLayout)

export const LayoutProvider = ({ children }: { children: JSX.Element }) => {
  const [typeLayout, setTypeLayout] = useState<TypeLayout>('default')
  const mainLayout = {
    typeLayout,
    setTypeLayout,
  }
  return <LayoutContext.Provider value={mainLayout}>{children}</LayoutContext.Provider>
}

export default LayoutProvider

export const useMainLayout = () => {
  return useContext(LayoutContext)
}
