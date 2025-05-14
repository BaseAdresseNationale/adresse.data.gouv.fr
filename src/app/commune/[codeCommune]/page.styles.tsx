'use client'

import styled from 'styled-components'

export const StyledCommunePage = styled.div<{ $certificationPercentage: number }>`

.communes-precedentes-wrapper {
    text-align: center;
    margin: 1rem 0;

    b {
        font-size: 1.2rem;
    }

}

.commune-main-section {
    > h1 {
        text-align: center;
    }

    .commune-general-info-wrapper {
        margin-bottom: 2rem;

        .commune-general-info {
            line-height: normal;
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
                }
            }

            .publication-recap {
                flex: 1 0 33%;
                padding: 1rem;
                display: flex;
                flex-direction: column;

                div {
                    background-color: white;
                    border-radius: 5px;
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
}
`
