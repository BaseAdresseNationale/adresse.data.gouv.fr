import styled from 'styled-components'

export const StyledWrapper = styled.div`
    position: relative;
    margin: 2rem 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .commune-link {
        margin-bottom: 2rem;
        align-self: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: fit-content;

        > b {
            margin-top: 1rem;
            font-size: 1.5rem;
        }
    }
`
