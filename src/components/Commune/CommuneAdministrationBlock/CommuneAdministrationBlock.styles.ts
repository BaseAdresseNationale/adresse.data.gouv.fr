'use client'

import styled from 'styled-components'
// blue-france
export const AdministrationBlockWrapper = styled.div`
  margin-bottom: 1.25rem;
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 1.25rem;
  background: var(--background-alt-purple-glycine);
  border: 1px solid var(--border-default-grey);
  border-radius: 6px;
  border-left: 4px solid var(--background-action-high-purple-glycine);
  color: var(--text-default-grey);

  .admin-block-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border-default-grey);
  }

  .admin-block-icon {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background: var(--background-action-high-purple-glycine);
    color: var(--text-inverted-grey);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    i {
      font-size: 1rem;
    }
  }

  .admin-block-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.4;
    color: var(--text-title-grey);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .admin-recap {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: stretch;
    gap: 1rem 2rem;
  }

  .admin-recap-item {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    min-width: 12rem;
    flex: 1 1 0;

    label {
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.01em;
      color: var(--text-mention-grey);
      line-height: 1.3;
      flex-shrink: 0;

      > i {
        margin-right: 0.375rem;
        color: var(--text-action-high-purple-glycine);
      }
    }

    .admin-recap-value {
      background: var(--background-raised-grey);
      border-radius: 4px;
      padding: 0.5rem 0.75rem;
      font-size: 0.8125rem;
      font-weight: 600;
      line-height: 1.4;
      color: var(--text-title-grey);
      border: 1px solid var(--border-default-grey);
      white-space: nowrap;
      min-height: 2.25rem;
      display: flex;
      align-items: center;

      &--active {
        background: var(--background-alt-purple-glycine);
        border-color: var(--border-plain-purple-glycine);
        color: var(--text-action-high-purple-glycine);
      }
    }
  }

  .admin-block-footer {
    margin-top: 0.75rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--border-default-grey);
    display: flex;
    justify-content: flex-end;
  }

  .admin-block-footer-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--text-action-high-purple-glycine);
    text-decoration: none;
    padding: 0.375rem 0.75rem;
    border-radius: 6px;
    background: var(--background-alt-purple-glycine);
    border: 1px solid var(--border-plain-purple-glycine);
    transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;

    &:hover {
      background: var(--background-action-low-purple-glycine-hover);
      border-color: var(--background-action-high-purple-glycine);
      color: var(--text-action-high-purple-glycine);
    }

    &:focus-visible {
      outline: 2px solid var(--background-action-high-purple-glycine);
      outline-offset: 2px;
    }

    .admin-block-footer-cta-arrow {
      transition: transform 0.2s ease;
    }

    &:hover .admin-block-footer-cta-arrow {
      transform: translateX(2px);
    }
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    .admin-block-footer {
      justify-content: stretch;
    }

    .admin-block-footer-cta {
      justify-content: center;
    }
  }
`
