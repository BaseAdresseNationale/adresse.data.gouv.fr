'use client'

import styled from 'styled-components'

export const StyledDeploiementBALDashboard = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;

    .stats {
        height: fit-content;
        display: grid;
        grid-template-columns: repeat( auto-fit, minmax(250px, 1fr) );
        gap: 1em;
        margin-top: 1em;
        margin-bottom: 3em;
        text-align: center;
    }

    .map-stats-container {
        display: flex;
        flex-direction: column;
        text-align: center;
    }

    .input-wrapper {
        max-width: 400px;
        margin-bottom: 2rem;
    }

    .bal-cover-map-container {
        height: 500px;
        width: 100%;
    }

    .bal-cover-map-container children {
        width: 100%;
    }
`
