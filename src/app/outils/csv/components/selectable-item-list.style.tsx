'use client'

import styled from 'styled-components'
import theme from '@/theme'

export const SelectableItemListWrapper = styled.div`
    .list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(auto, 200px));
      grid-gap: 5px;
    }

    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid ${theme.colors.grey.main};
      white-space: nowrap;
      width: 100%;
      background: ${theme.colors.primary.bg};
      color: ${theme.colors.grey.main};
      cursor: pointer;
    }

    .item .text {
      overflow: auto;
      text-overflow: ellipsis;
      margin-left: 0.5em;
      margin-right: 0.5em;
      color: ${theme.colors.grey};
    }

    .selection {
      margin: 2em 0;
      padding: 0.5em;
      border: 1px dashed #ccc;
      background: #fff;
    }

    .button {
      font-size: larger;
      font-weight: bold;
      text-align: center;
      min-width: 20px;
      background: ${theme.colors.primary.badge};
    }
`
