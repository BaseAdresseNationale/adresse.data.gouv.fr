'use client'

import styled from 'styled-components'

export const StyledCommunePage = styled.div`

.commune-main-section {
    > h1 {
        text-align: center;
    }

    .commune-general-info-wrapper {
        margin-bottom: 2rem;

        .commune-general-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 1rem;

            div {
                margin-top: 0.5rem;
                font-size: 1.5rem;
                margin-bottom: 1rem;
            }
        }
    }
    
    .commune-adresse-info-wrapper {
        background-color: ${({ theme }) => theme.colors.grey.bg};
        margin-bottom: 2rem;
        width: 100%;
    
        > div {
            &:not(:first-of-type) {
                margin-top: 1rem;
            }

            .adresse-recap {
                flex: 1 0 33%;
                padding: 1rem;
                display: flex;
                justify-content: center;
                align-items: center;

                div {
                    font-size: 2.5rem;
                    font-weight: bold;
                    margin-right: 1rem;
                    white-space: nowrap;
                }

                label {
                    font-size: 1.3rem;
                }
            }
            
            .publication-recap {
                flex: 1 0 33%;
                padding: 1rem;
                display: flex;
                flex-direction: column;

                div {
                    background-color: white;
                    border-radius: 10px;
                    padding: 1rem;
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                    margin-top: 1rem;
                }

                label {
                    font-size: 1.3rem;
                }
            }
        }
    }
}



.modification-history-wrapper {
    margin-top: 2rem;
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
    display: flex;
    flex-direction: column;

    h3 {
        font-size: 1.5rem;
        line-height: 2rem;
    }

    .fr-table {
        align-self: center;
    }
}

@media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    .commune-main-section {

    .commune-general-info-wrapper {
        margin-bottom: 1rem;

        .commune-general-info {
            padding: 0.5rem;

            div {
                margin-bottom: 0;
            }
        }
    }
    
    .commune-adresse-info-wrapper {

        > div {

            .adresse-recap {
                justify-content: flex-start;
            }
            
            .publication-recap {
                padding: 0 1rem;

                div {
                    background-color: white;
                    border-radius: 10px;
                    padding: 1rem;
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                    margin-top: 1rem;
                }

                label {
                    font-size: 1.3rem;
                }
            }
        }
    }
}

table {
    max-width: calc(100vw - 3rem);
}
}
`
