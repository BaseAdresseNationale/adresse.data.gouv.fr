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
        position: absolute;
        top: 8px;
        left: 13px;
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
