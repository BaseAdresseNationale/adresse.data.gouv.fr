'use client'

import styled from 'styled-components'

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: unset !important;
  margin: unset !important;

  section:not(:first-child) {
    margin-top: 2em;
  }

  .form-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    > div {
      width: 100%;

      &:not(:first-child) {
        margin-left: 1em;
      }
    }
  }

  .form-controls {
    display: flex;
    margin-top: 1em;

    > :last-child {
      margin-left: 1em;
    }
  }
`
