'use client'

import SearchBAN from '@/components/SearchBAN'

import {
  CartoWrapper,
  CartoMenu,
  CartoBody,
} from './layout.styles'

export default function RootLayout({ children }: { children: JSX.Element }) {
  return (
    <CartoWrapper>
      <CartoMenu>
        <SearchBAN />
      </CartoMenu>
      <CartoBody>
        { children }
      </CartoBody>
    </CartoWrapper>
  )
}
