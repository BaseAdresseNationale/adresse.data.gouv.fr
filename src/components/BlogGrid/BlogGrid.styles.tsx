import styled, { css } from 'styled-components'

import CardWrapperAPP from '@/components/CardWrapper'

export const BlogPostWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(calc(30% - 1rem), 1fr));
  grid-gap: 1rem;
  gap: 1rem;
`

export const BlogGridFooter = styled.footer`
  padding: 3rem 0 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`

export const CardWrapper = styled(CardWrapperAPP)<{ $loading?: boolean }>`
    filter: grayscale(0) blur(0px);
    filter: ${
      ({ $loading }) => $loading
        ? css`grayscale(1) blur(5px)`
        : css`grayscale(0) blur(0px)`
      };
    transition: filter ease;
    transition-duration: .6s;
`
