'use client'

import styled from 'styled-components'
import theme from '@/theme'

export const Code = styled.code`
    background: #ffff;
    border: 1px solid ${theme.colors.grey.border};
    border-radius: 5px;
    width: 100%;
    padding: 1em;
    margin: 1em 0;
    color: ${theme.colors.grey.main};
    white-space: pre-wrap;
    word-break: normal;
    display: block;
    line-height: 1.8;
    font-family: monospace;
`

export const ApiEntryPoint = styled.div`

    display: flex;
    flex-flow: wrap;
    justify-content: space-between;
    padding: 40px 0;

    &:not(:first-child) {
        border-top: 1px solid ${theme.colors.grey.border};
    }

    .details {
        background-color: ${theme.colors.primary.bg};
        color: ${theme.colors.grey};
        padding: 40px;
        border: 1px solid ${theme.colors.primary.border};
        border-radius: 5px;
        box-shadow: 0 1px 4px 0 ${theme.colors.grey.border};
        width: 100%;
    }

    @media (min-width: ${theme.breakpoints.lg}) {

        flex-flow: row;
        
        .details {
            width: 70%;
        }

        .description {
            width: 25%;
        }
    }
`
