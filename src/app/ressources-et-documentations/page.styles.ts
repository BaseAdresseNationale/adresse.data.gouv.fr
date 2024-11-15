'use client'

import styled from 'styled-components'

export const StyledPage = styled.div`
.on-this-page {
    display: flex;
    align-items: center;
    > div {
        flex: 1;       
         padding: 2rem;

    }
    .text-wrapper {
        ul {
            margin: 2rem 0;
            padding: 2rem 0;
            border: 1px solid ${({ theme }) => theme.colors.grey.border};
            border-left: none;
            border-right: none;
        }

        .logo-wrapper {
            display: flex;
            justify-content: space-around ;
        }
    }
}

.stay-tuned {
    padding-bottom: 0 !important;
    > div {
        display: flex;

        > .text-wrapper {
            text-align: right;
            margin-right: 4rem;

            > i::before {
                height: 2.5rem;
                width: 2.5rem;
                margin-bottom: 1rem;
            }
        }

        > .illustration-wrapper {
            height: 310px;
            width: 470px;
            flex-shrink: 0;
            position: relative;

            > img {
                position: absolute;
                bottom: -38px;
            }
        }
    }

}

.guide-section {
    > div {
        display: flex;
        align-items: center;

        > .text-wrapper {
            flex-basis: 60%;

            > button {
                margin: 2rem 0;
            }
            > div {
                margin-bottom: 2rem;
                > h2 {
                    font-size: 1.5rem;
                    margin-bottom: 0.1rem;
                }
                > legend {
                    font-size: 0.8rem;
                    color: ${({ theme }) => theme.colors.grey.main};

                }
            }
        }

        > .illustration-wrapper {
            padding: 2rem;
            flex-basis: 40%;
            display: flex;
            justify-content: center;
        }
    }
}

@media screen and (max-width: ${props => props.theme.breakpoints.md}) {
    .illustration-wrapper {
        display: none;
    }

    .stay-tuned {
        padding-bottom: 1.5rem !important;
        > div {
            display: flex;

            > .text-wrapper {
                text-align: initial;
                margin-right: 0;
            }
        }
    }
}
`
