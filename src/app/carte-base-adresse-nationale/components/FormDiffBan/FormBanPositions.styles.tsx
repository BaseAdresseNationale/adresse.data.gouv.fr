'use client'

import styled from 'styled-components'

export const LabelWrapper = styled.div`
  display: flex;
  gap: .5rem;
  margin-top: 0.5rem;

  /* TODO : Expose this from React-DSFR with props 'hideLabel' */
  label {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
    display: block;
  }

  & > button {
    margin-top: .5rem;
  }

  & > * {
    flex: 1;

    &:first-child {
      max-width: 8rem;
    }
  }
`
