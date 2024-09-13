'use client'

import styled from 'styled-components'

export const StyledDeploiementBALDashboard = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;

    .map-stats-container {
        display: flex;
        justify-content: space-around;
        height: calc(100vh - 270px);
        text-align: center;
    }

    .stats-wrapper {
        display: flex;
        flex-direction: column;
        width: 30%;
        padding: 1em;
        overflow: scroll;

        .fr-tabs {
            margin-top: 1em;

            .fr-tabs__panel {
                overflow: scroll;
                height: 100%;
                padding: 1rem;
            }
        }
    }

    .stats {
        height: fit-content;
        display: grid;
        grid-template-columns: repeat( auto-fit, minmax(250px, 1fr) );
        gap: 1em;
        margin-top: 1em;
    }

    .bal-cover-map-container {
        height: 100%;
        min-height: 400px;
        width: 70%;
    }

    .bal-cover-map-container children {
        width: 100%;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        .map-stats-container {
            flex-direction: column;
        }
        .bal-cover-map-container {
            width: 100%;
            height: 100%;
        }
        .stats-wrapper {
            width: 100%;
            height: 100%;
        }
    }
`
