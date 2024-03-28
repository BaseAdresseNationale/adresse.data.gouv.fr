import styled from 'styled-components'

export const SignalementTypeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const StyledForm = styled.form`
  position: relative;
  padding: 20px;
  display: flex;
  flex-direction: column;
  max-width: unset !important;
  margin: unset !important;
  overflow: scroll;

  section:not(:first-of-type) {
    margin-top: 2em;
  }

  .signalement-recap {
    display: flex;
    justify-content: space-between;
    margin-top: 1em;

    > div {
      width: 100%;
      padding: 1em;
    }
  }

  .close-btn {
    position: absolute;
    top: 15px;
    right: 10px;

    :hover {
      cursor: pointer;
      background-color: transparent;
    }
  }

  .form-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    > div {
      width: 100%;

      &:not(:first-child) {
        margin-left: 1em;
      }
    }
  }

  .fr-alert {
    margin-top: 15px;
  }

  .form-controls {
    display: flex;
    margin-top: 1em;

    > :last-child {
      margin-left: 1em;
    }
  }

  .parcelles-wrapper {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    > div {
      margin-right: 1em;
      margin-bottom: 1em;
      padding: 0.5em;
      background-color: #f5f5f5;
      border-radius: 5px;
    }
  }

  h6 {
    margin: 1em 0 0 0;
  }

  legend {
    font-style: italic;
  }
`
