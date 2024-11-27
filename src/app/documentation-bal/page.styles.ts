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

            > .ban-logo {
                max-width: 180px;
                max-height: 80px;
            }
            > .bal-logo {
                max-width: 140px;
                max-height: 80px;
            }
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
            > .buttons-wrapper {
                display: flex;
                align-items: center;
                > a {
                    margin-right: 1rem;
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

    .on-this-page {
        .text-wrapper {
            padding: 0;

            .logo-wrapper {
                > .ban-logo {
                    max-width: 90px;
                    max-height: 40px;
                }
                > .bal-logo {
                    max-width: 70px;
                    max-height: 40px;
                }
            }
        }
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

    .guide-section {
        > div {
            flex-direction: column;

            > .text-wrapper {
                flex-basis: 100%;
                order: 1;
            }

            > .illustration-wrapper {
                flex-basis: 100%;
                order: 2;
            }
        }
    }
}
`
