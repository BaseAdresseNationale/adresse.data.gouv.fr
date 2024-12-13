'use client'

import styled from 'styled-components'
import theme from '@/theme'

export const ColumnSelectWrapper = styled.div`
    .columns {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(auto, 200px));
      grid-gap: 5px;
    }

    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid ${theme.colors.grey.border};
    }
    
    .item .text {
      background-color: ${theme.colors.primary};
    }

    .item:hover {
      cursor: pointer;
    }

    .column {
      margin: 0 1em;
    }

    .selection {
      margin: 2em 0;
      padding: 0.5em;
      border: 1px dashed #ccc;
    }

    .button {
      font-size: larger;
      font-weight: bold;
      text-align: center;
      width: 20px;
      color: ${theme.colors.grey};
      background-color: ${theme.colors.grey.badge};
    }
  `
