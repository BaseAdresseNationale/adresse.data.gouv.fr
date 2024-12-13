'use client'

import styled from 'styled-components'
import theme from '@/theme'

export const TextWrapper = styled.div`

    .filters {
      margin: 1em 0;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 1em 0;
    }

    .error {
      color: red;
    }

    .col {
      display: flex;
      align-items: center;
    }

    .file-details {
      display: flex;
      align-items: center;
    }

    .file-infos {
      border-left: 3px solid ${theme.colors.primary.border};
      margin-left: 5px;
      padding: 0 5px;
    }

    .disabled {
          color: ${theme.colors.grey.badge};
    }

    .fr-table {
      display: block;
      overflow: scroll;
    }
  `
