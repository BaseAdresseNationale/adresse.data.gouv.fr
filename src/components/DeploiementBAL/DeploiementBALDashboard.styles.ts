'use client'

import styled from 'styled-components'

export const StyledDeploiementBALDashboard = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;

    .map-stats-container {
        display: flex;
        flex-direction: column;
        text-align: center;
    }

    .input-wrapper {
        max-width: 400px;
        margin-bottom: 1rem;
    }

    .stats-wrapper {
        display: flex;
        flex-direction: column;
        overflow: scroll;

        .fr-tabs {
            margin-top: 1em;
            height: 340px;

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
        height: 500px;
        width: 100%;
    }

    .bal-cover-map-container children {
        width: 100%;
    }
`
