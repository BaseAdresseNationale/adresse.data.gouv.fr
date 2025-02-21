'use client'

import styled from 'styled-components'

export const StyledWrapper = styled.div<{ $certificationPercentage: number }>`
        background: ${({ theme, $certificationPercentage }) => $certificationPercentage === 0 ? `${theme.colors.grey.bg};` : $certificationPercentage === 100 ? `var(--background-contrast-success);` : `linear-gradient(90deg, var(--background-contrast-success) ${$certificationPercentage - 5}%, ${theme.colors.grey.bg} ${$certificationPercentage + 5}%);`};
        border-radius: 5px;
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
                    > i {
                      margin-left: 1rem; 
                    }
                }
            }

            .publication-recap {
                flex: 1 0 33%;
                padding: 1rem;
                display: flex;
                flex-direction: column;

                div {
                    background-color: light-dark(white, var(--background-default-grey));
                    border-radius: 5px;
                    padding: 1rem;
                    font-size: 1rem;
                    margin-bottom: 1rem;
                    margin-top: 1rem;
                    font-weight: bold;
                }

                label {
                    font-size: 1.3rem;

                    > i {
                      margin-right: 0.5rem;
                    }
                }
            }
        }


@media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {

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
                margin-bottom: 1rem;
                margin-top: 1rem;
            }

            label {
                font-size: 1.3rem;
            }
        }
    }
}
`
