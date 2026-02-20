import styled from 'styled-components'

export const Wrapper = styled.div`
  min-height: 18rem;
  display: flex;
  gap: 3rem;
  padding: 2rem 0;

  flex-direction: column;
  @media screen and (min-width: 768px) {
      flex-direction: row;
  }
`

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const FormWrapperFooter = styled.footer`
  padding: 1.5rem 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  flex-direction: column;
  align-items: flex-start;

  @media screen and (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`

export const IntroWrapper = styled.div`
  display: block;
  text-align: center;
  max-width: 25rem;
`

export const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.2em;
`

export const FormDescription = styled.div`
  font-size: 1rem;
  margin-bottom: .5em;
`

export const FormInformation = styled.div`
  font-size: .75rem;
  margin-bottom: .5em;
  font-style: italic;
  text-align:right;
`

export const ButtonLink = styled.button<{ href: string }>``
