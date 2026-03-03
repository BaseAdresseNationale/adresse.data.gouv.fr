'use client'

import styled from 'styled-components'

export const ProfileCard = styled.div`
  font-family: var(--font-family-default);
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: var(--blue-france-975-75);
  border: 1px solid var(--blue-france-850-200);
  border-left: 0.25rem solid var(--blue-france-sun-113-625);
  border-radius: 0.25rem;
  position: relative;
  flex-wrap: wrap;

  .profile__avatar {
    width: 3rem;
    height: 3rem;
    min-width: 3rem;
    border-radius: 50%;
    background: var(--blue-france-sun-113-625);
    color: var(--text-inverted-grey);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.125rem;
    font-weight: 700;
    flex-shrink: 0;
    letter-spacing: 0.05em;
    user-select: none;
    border: 0.125rem solid var(--blue-france-850-200);
  }

  .profile__info {
    flex: 1;
    min-width: 0;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.25rem 0;
    align-content: start;
  }

  .profile__name {
    font-size: 1.125rem;
    font-weight: 700;
    line-height: 1.5;
    color: var(--text-title-grey);
    margin: 0;
    padding: 0 5.5rem 0 0;
    grid-column: 1;
  }

  .profile__row {
    display: grid;
    grid-template-columns: 1rem 1fr;
    gap: 0 0.375rem;
    align-items: center;
    font-size: 0.875rem;
    line-height: 1.5;
    color: var(--text-default-grey);
    margin: 0;
    grid-column: 1;
  }

  /* Annule les marges DSFR pour garder l’alignement avec le nom */
  .profile__row .fr-icon {
    margin: 0 !important;
  }

  .profile__row-icon {
    font-size: 0.875rem;
    color: var(--blue-france-sun-113-625);
    grid-column: 1;
    width: 1rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .profile__row .fr-text--sm {
    grid-column: 2;
    margin: 0 !important;
  }

  .profile__badge-corner {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
`

export const EmptyStateBox = styled.div`
  font-family: var(--font-family-default);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  .empty-state-icon {
    font-size: 2.5rem;
    color: var(--text-mention-grey);
  }
  .empty-state-desc {
    max-width: 28rem;
  }
`

export const FavoritesTableWrapper = styled.div`
  font-family: var(--font-family-default);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 0 0 0.25rem 0.25rem;

  background:
    linear-gradient(to right, var(--background-default-grey) 1rem, transparent 1rem),
    linear-gradient(to left, var(--background-default-grey) 1rem, transparent 1rem) right,
    radial-gradient(farthest-side at 0 50%, rgba(0,0,0,0.08), transparent) 0 0,
    radial-gradient(farthest-side at 100% 50%, rgba(0,0,0,0.08), transparent) 100% 0;
  background-repeat: no-repeat;
  background-size:
    1.5rem 100%, 1.5rem 100%,
    0.5rem 100%, 0.5rem 100%;
  background-attachment: local, local, scroll, scroll;

  table {
    min-width: 52rem;
    width: 100%;
    margin: 0 !important;
    border-collapse: collapse;
  }

  thead th {
    background: var(--blue-france-975-75) !important;
    color: var(--text-default-grey);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 700;
    white-space: nowrap;
    padding: 0.625rem 1rem;
    border-bottom: 0.125rem solid var(--blue-france-850-200);
    vertical-align: middle;
  }

  tbody td {
    padding: 0.625rem 1rem;
    vertical-align: middle;
    font-size: 0.875rem;
    border-bottom: 1px solid var(--border-default-grey);
    color: var(--text-default-grey);
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr:hover td {
    background: var(--blue-france-975-75);
  }

  .col-num {
    text-align: right;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .col-num--muted {
    color: var(--text-mention-grey);
  }

  .cert-cell {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 4.5rem;
    align-items: flex-end;
  }

  .cert-cell__label {
    font-weight: 700;
    font-size: 0.875rem;
  }

  .cert-cell__label--high   { color: var(--text-default-success); }
  .cert-cell__label--mid    { color: var(--text-default-warning); }
  .cert-cell__label--low    { color: var(--text-mention-grey); }

  .cert-bar {
    width: 4rem;
    height: 0.25rem;
    background: var(--border-default-grey);
    border-radius: 0.125rem;
    overflow: hidden;
  }

  .cert-bar__fill {
    height: 100%;
    border-radius: 0.125rem;
    transition: width 0.4s ease-out;
  }

  .cert-bar__fill--high { background: var(--success-425-625); }
  .cert-bar__fill--mid  { background: var(--warning-425-625); }
  .cert-bar__fill--low  { background: var(--text-mention-grey); }

  .cert-cell__count {
    font-size: 0.75rem;
    color: var(--text-mention-grey);
    text-align: right;
  }

  .actions-cell {
    display: flex;
    gap: 0.25rem;
    align-items: center;
    justify-content: flex-end;
  }

  .cell-nowrap {
    white-space: nowrap;
  }

  .cell-webhook {
    max-width: 16rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.875rem;
    font-family: var(--font-family-code);
  }
`

export const CommuneHeroCard = styled.div`
  font-family: var(--font-family-default);
  a.commune-hero__link {
    display: flex;
    align-items: center;
    gap: 0.5rem 1.5rem;
    padding: 0.25rem 1rem;
    background: var(--blue-france-975-75);
    border: 1px solid var(--blue-france-850-200);
    border-left: 0.25rem solid var(--blue-france-sun-113-625);
    border-radius: 0.25rem;
    color: var(--text-default-grey);
    text-decoration: none;
    cursor: pointer;
    font-size: 0.875rem;
    flex-wrap: wrap;
    transition: background 0.15s ease;
  }
  a.commune-hero__link:hover {
    background: var(--blue-france-925-125);
    color: var(--text-default-grey);
    text-decoration: underline;
  }
  a.commune-hero__link:hover .commune-hero__cta,
  a.commune-hero__link:hover .commune-hero__cta .fr-icon {
    color: var(--blue-france-sun-113-625) !important;
  }
  a.commune-hero__link:focus-visible {
    outline: 0.125rem solid var(--blue-france-sun-113-625);
    outline-offset: 0.125rem;
  }

  .commune-hero__blason {
    flex-shrink: 0;
    width: 1.5rem;
    height: 1.5rem;
  }
  .commune-hero__blason img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .commune-hero__name {
    font-weight: 700;
    color: var(--text-default-grey);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 20rem;
  }
  .commune-hero__sep {
    color: var(--border-default-grey);
    font-weight: 400;
    user-select: none;
  }
  .commune-hero__meta,
  .commune-hero__stat {
    color: var(--text-default-grey);
  }
  .commune-hero__stat strong {
    font-weight: 700;
    color: var(--text-default-grey);
  }
  a.commune-hero__link .commune-hero__cta,
  a.commune-hero__link .commune-hero__cta .fr-icon {
    color: var(--blue-france-sun-113-625) !important;
  }
  .commune-hero__cta {
    margin-left: auto;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    white-space: nowrap;
  }

  .commune-hero__stat .cert-cell {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    align-items: flex-end;
    min-width: 4rem;
  }
  .commune-hero__stat .cert-cell__label {
    font-weight: 700;
    font-size: 0.875rem;
  }
  .commune-hero__stat .cert-cell__label--high { color: var(--text-default-success); }
  .commune-hero__stat .cert-cell__label--mid { color: var(--text-default-warning); }
  .commune-hero__stat .cert-cell__label--low { color: var(--text-mention-grey); }
  .commune-hero__stat .cert-bar {
    width: 4rem;
    height: 0.25rem;
    background: var(--border-default-grey);
    border-radius: 0.125rem;
    overflow: hidden;
  }
  .commune-hero__stat .cert-bar__fill {
    height: 100%;
    border-radius: 0.125rem;
    transition: width 0.4s ease-out;
  }
  .commune-hero__stat .cert-bar__fill--high { background: var(--success-425-625); }
  .commune-hero__stat .cert-bar__fill--mid { background: var(--warning-425-625); }
  .commune-hero__stat .cert-bar__fill--low { background: var(--text-mention-grey); }
  .commune-hero__stat .cert-cell__count {
    font-size: 0.75rem;
    color: var(--text-mention-grey);
  }
`

export const SectionEditCard = styled.div`
  font-family: var(--font-family-default);
  border-radius: 0.25rem;
  border: 1px solid var(--blue-france-850-200);
  border-left: 0.25rem solid var(--blue-france-sun-113-625);
  background: var(--background-default-grey);
  overflow: hidden;

  .sec-card__header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    flex-wrap: wrap;
  }

  .sec-card__header-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    min-width: 0;
  }

  .sec-card__icon {
    font-size: 1.5rem;
    color: var(--blue-france-sun-113-625);
    flex-shrink: 0;
  }

  .sec-card__title {
    font-size: 1rem;
    font-weight: 700;
    margin: 0 0 0.25rem;
    color: var(--text-title-grey);
  }

  .sec-card__value {
    font-size: 0.875rem;
    color: var(--text-mention-grey);
    margin: 0;
  }

  .sec-card__body {
    padding: 1.5rem;
    border-top: 1px solid var(--blue-france-850-200);
    background: var(--blue-france-975-75);
  }

  .sec-card__body--neutral {
    background: var(--background-default-grey);
    padding: 0;
  }

  .mandatary-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1rem;
    background: var(--background-default-grey);
    border: 1px solid var(--border-default-grey);
    border-radius: 0.25rem;
    flex-wrap: wrap;
  }

  .mandatary-row__icon {
    color: var(--blue-france-sun-113-625);
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .mandatary-row__info {
    flex: 1;
    min-width: 0;
  }

  .mandatary-row__label {
    display: block;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--blue-france-sun-113-625);
    margin-bottom: 0.25rem;
  }

  .mandatary-row__name {
    font-weight: 700;
    font-size: 1rem;
    color: var(--text-default-grey);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mandatary-edit-sep {
    border: none;
    border-top: 1px solid var(--blue-france-850-200);
    margin: 1.5rem 0;
  }

  .mandatary-edit-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: 1rem;
  }
`

export const StickyActions = styled.div`
  font-family: var(--font-family-default);
  position: sticky;
  bottom: 0;
  background: var(--background-default-grey);
  border-top: 0.125rem solid var(--blue-france-sun-113-625);
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  z-index: 100;
  box-shadow: var(--raised-shadow, 0 -0.125rem 0.375rem rgba(0, 0, 0, 0.08));
  margin-top: 1rem;
  flex-wrap: wrap;

  .sticky-left {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem 0.75rem;
    flex: 1;
    min-width: 0;
  }

  .sticky-left__badge {
    flex-shrink: 0;
  }

  .sticky-left__hint {
    margin: 0;
    line-height: 1.5;
  }

  @media (max-width: 48em) {
    .sticky-left__hint {
      width: 100%;
    }
  }

  .sticky-saving {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
    min-width: 0;
  }

  .sticky-saving__label {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--blue-france-sun-113-625);
    margin: 0;
  }

  .sticky-progress {
    width: 100%;
    height: 0.25rem;
    background: var(--blue-france-850-200);
    border-radius: 0.125rem;
    overflow: hidden;
  }

  .sticky-progress__bar {
    height: 100%;
    background: var(--blue-france-sun-113-625);
    border-radius: 0.125rem;
    transition: width 0.3s ease-out;
  }

  .sticky-btns {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .sticky-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    flex: 1;
  }

  .sticky-message--success {
    color: var(--text-default-success);
  }

  .sticky-message--error {
    color: var(--text-default-error);
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .sticky-message__close,
  .sticky-message__close * {
    color: inherit !important;
    flex-shrink: 0;
  }
`
