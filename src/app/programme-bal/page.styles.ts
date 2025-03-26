'use client'

import styled from 'styled-components'

export const StyledPageProgrammeBAL = styled.div`
  .improve-quality-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .action-list > div {
    display: flex;
    align-items: center;
    margin: 20px 0;
  }

  .action-number {
    font-size: 60px;
    font-weight: bold;
    color: var(--blue-france-main-525);
    padding: 0 10px;
    flex-basis: 70px;
  }

  .action {
    margin-left: 20px;
  }

  .action > h4 {
    margin-bottom: 0;
  }

  .action > p {
    margin-bottom: 5px;
  }

  .image-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .image-wrapper img {
    object-fit: contain;
    max-height: 400px;
  }

  .main-steps-row {
    margin-top: 50px;
    align-items: center;
  }

  .quote-wrapper {
    justify-content: space-between;
  }

  .space-between-row {
    justify-content: space-between;
    align-items: center;
  }

  .space-around-row {
    justify-content: space-around;
    align-items: center;
  }

  .align-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .inner-list {
    list-style-type: none;
    margin-left: 0;
    padding-left: 0;
  }

  .inner-list > li {
    margin-bottom: 5px;
  }

  .inner-list > li > .fr-icon-check-line {
    margin-right: 10px;
    color: var(--blue-france-sun-113-625);
  }

  .main-steps-card {
    padding: 30px 20px;
    background-color: var(--blue-france-975-75);
  }

  .cta-card {
    background: white;
    border: 1px solid #dddddd;
    padding: 30px;
  }

  .fr-quote {
    display: block;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    .hide-mobile {
      display: none;
    }

    .main-steps-card {
      padding: 0;
      background-color: white;
    }

    .main-steps-row {
      margin-top: 20px;
    }

    .cta-card:first-of-type {
      margin-bottom: 20px;
    }

    .reasons-list-title {
      text-transform: lowercase;
    }

    .reasons-list-title::before {
      content: "Pour ";
      text-transform: capitalize;
    }
  }
`
