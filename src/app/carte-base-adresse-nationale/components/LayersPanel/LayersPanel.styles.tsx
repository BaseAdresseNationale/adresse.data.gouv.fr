'use client'

import styled from 'styled-components'

export const PanelSection = styled.section`
  width: 100%;
  max-height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: var(--background-default-grey);
`

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.25rem 0.25rem 0.25rem 0.75rem;
  border-bottom: 1px solid var(--border-default-grey);
`

export const PanelTitle = styled.h2`
  margin: 0;
  font-size: 1rem;
  line-height: 1.5rem;
`

export const PanelContent = styled.div`
  overflow-y: auto;
  flex: 1;
  padding: 0.75rem;
`

export const LayerFieldset = styled.fieldset`
  border: 0;
  margin: 0 0 1rem;
  padding: 0;
  min-width: 0;

  &:last-child {
    margin-bottom: 0;
  }
`

export const LayerLegend = styled.legend`
  padding: 0;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
`

export const LayerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
`

export const LayerThumbnail = styled.span`
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: 0.25rem;
  box-shadow: 0 0 0 1px var(--border-default-grey);
  transition: border-color 0.15s;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const LayerHint = styled.span`
  font-size: 0.7rem;
  font-weight: 400;
  color: var(--text-mention-grey);
`

// La vraie case (radio ou checkbox) reste dans le flux pour le clavier et les lecteurs d'écran ;
// la vignette porte l'état visuel (sélection, focus, indisponibilité).
export const LayerOption = styled.div`
  position: relative;

  input {
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    line-height: 1.2;
    text-align: center;
    cursor: pointer;
  }

  label:hover ${LayerThumbnail} {
    border-color: var(--border-default-blue-france);
  }

  input:checked + label {
    font-weight: 700;
    color: var(--text-action-high-blue-france);
  }

  input:checked + label ${LayerThumbnail} {
    border-color: var(--border-active-blue-france);
  }

  input:focus-visible + label ${LayerThumbnail} {
    outline: 2px solid #0a76f6;
    outline-offset: 2px;
  }

  input:disabled + label {
    cursor: not-allowed;
    color: var(--text-disabled-grey);
  }

  input:disabled + label ${LayerThumbnail} {
    border-color: transparent;
    filter: grayscale(1);
    opacity: 0.6;
  }
`
