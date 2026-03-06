import styled, { css } from 'styled-components'

export const PanelContainer = styled.div`
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  min-height: 0; 
  background: #fff;
  display: flex;
  flex-direction: column; 
`

export const PanelHeader = styled.div`
  padding: 0.75rem;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
`

export const PanelContent = styled.div`
  overflow-y: auto;
  flex: 1;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background-color: #d3d3d3;
  padding: 1px; 
`

export const Card = styled.div.attrs({ tabIndex: 0 })`
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #fff;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  &:hover,
  &:focus {
    background-color: #f0f0f0;
  }

  img {
    max-width: 60%;
    margin-bottom: 0.25rem;
  }

  label {
    font-size: 0.75rem;
    text-align: center;
  }
`
