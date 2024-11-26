'use client'

import styled from 'styled-components'
import theme from '@/theme'

export const HolderWrapper = styled.div`

    .dropzone {
      display: flex;
      flex-flow: column;
      justify-content: center;
      width: 100%;
      border: 1px dashed #ccc;
      height: 200px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
    }

    .dropzone:hover {
      background-color: #ebeff3;
    }

    .dropzone.file {
      display: flex;
      flex-flow: column;
      height: auto;
      border: none;
    }

    .file-container {
      width: 100%;
    }

    .file-sumup {
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-align: left;
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

    .name {
      font-weight: bolder;
    }

    .size {
      font-style: italic;
      font-size: 14px;
    }

    .active {
      background-color: #ebeff3;
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-style: italic;
    }
    .loading span {
      margin-left: 1em;
    }

    span > .fr-icon-refresh-fill {
    margin-right: 10px;
    color: var(--blue-france-sun-113-625);
    }
  `
