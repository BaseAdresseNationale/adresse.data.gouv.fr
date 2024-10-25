'use client'

import styled from 'styled-components'

const colors = {
  almostBlack: '#26353f',
  blue: '#0053B3',
}

export const PopupWrapper = styled.div`
  .heading {
    display: grid;
    grid-template-columns: 3fr 1fr;
    grid-gap: .5em;
    align-items: flex-start;
  }

  .commune {
    font-style: italic;
    color: ${colors.almostBlack};
  }

  .infos-container {
    display: grid;
    grid-template-columns: 10px 1fr;
    margin-top: 2em;
  }

  .separator {
    width: 0px;
    border: 1px solid ${colors.blue};
  }

  .infos {
    display: grid;
    align-items: center;
    grid-template-rows: 1fr 1fr;
  }
`
