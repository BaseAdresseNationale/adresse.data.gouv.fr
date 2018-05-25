import {Fragment} from 'react'

import theme from '../styles/theme'

import Fonts from './styles/fonts'

const MainStyle = () => (
  <Fragment>
    <Fonts />
    <style jsx global>{`
      * {
          box-sizing: border-box;
        }

        body {
          padding: 0;
          margin: 0;
          position: relative;
          overflow: auto;
          background: ${theme.backgroundGrey};
        }

        a,
        button {
          outline: none;
          cursor: pointer;
        }

        a,
        a:hover,
        a:focus,
        a:visited,
        a:active {
          color: ${theme.primary};
          text-decoration: none;
          transition: color 0.2s ease-out;
          overflow-wrap: break-word;
          word-wrap: break-word;
        }

        @custom-media --smaller-than-mobile (max-width: 399px);
        @custom-media --larger-than-mobile (min-width: 400px);

        @custom-media --smaller-than-phablet (max-width: 549px);
        @custom-media --larger-than-phablet (min-width: 550px);

        @custom-media --smaller-than-tablet (max-width: 749px);
        @custom-media --larger-than-tablet (min-width: 750px);

        @custom-media --smaller-than-desktop (max-width: 999px);
        @custom-media --larger-than-desktop (min-width: 1000px);

        body {
          font-family: "Source Sans Pro", Arial, sans-serif;
          font-size: 16px;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: "Evolventa", "Trebuchet MS", sans-serif;
        }

        h1 {
          font-size: 1.8em;
        }

        h2 {
          font-size: 1.5em;
        }

        h3 {
          font-size: 1.25em;
        }

        h4 {
          font-size: 1em;
        }

        .subtitle {
          color: ${theme.colors.darkGrey};
        }

        pre {
          display: block;
          margin-top: 1em;
        }

        code {
          background: ${theme.colors.lighterGrey};
          border-radius: ${theme.borderRadius};
          padding: 0.5em;
          font-family: 'Courier New';
          word-break: break-word;
          white-space: pre-wrap;
          vertical-align: middle;
          display: inline-block;
          width: 100%;
          max-width: 100%;
          overflow-x: auto;
        }

        pre code {
          font-size: 1em;
          padding: 1em;
          box-sizing: border-box;
        }

        input,
        select {
          width: 100%;
          outline: none;
          padding: 10px 15px;
          font: inherit;
          line-height: 1.6;
          color: ${theme.colors.black};
          border-radius: ${theme.borderRadius};
          box-sizing: border-box;
          border: 1px solid ${theme.border};
          background: ${theme.backgroundWhite};
          vertical-align: middle;
          position: relative;
        }

        input:focus,
        select:focus {
          background-color: ${theme.backgroundWhite};
          border-color: ${theme.primary};
          transition: border-color 0.2s ease-out;
        }

        input[type=radio],
        input[type=checkbox] {
          margin-right: 6px;
          margin-top: 0;
        }

        input[type=radio]:empty,
        input[type=checkbox]:empty {
          background-color: ${theme.backgroundGrey};
        }

        input[type=radio] {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          display: inline-block;
          appearance: none;
          padding: 0;
        }

        input[type=radio]::before {
          content: '';
          border-color: ${theme.primary};
          border-radius: 50%;
          position: absolute;
          top: 5px;
          left: 5px;
          width: 8px;
          height: 8px;
          transform: scale(0);
        }

        input[type=radio]:checked {
          background-color: ${theme.backgroundWhite};
          border-color: ${theme.primary};
          opacity: 1;
        }

        input[type=radio]:checked::before {
          background-color: ${theme.primary};
          transform: scale(1);
          transition: transform 0.2s ease-out;
        }

        input[type="checkbox"] {
          appearance: none;
          height: 22px;
          width: 22px;
          padding: 0;
        }

        input[type="checkbox"]:checked {
          background-color: ${theme.primary};
          border-color: ${theme.primary};
          opacity: 1;
          transition: border-color 0.2s ease-in, background-color 0.2s ease-out;
        }

        input[type="checkbox"]::before {
          transform: scale(0);
          content: '';
          position: absolute;
          top: 3px;
          left: 3px;
          height: 14px;
          width: 14px;
          background: url("../static/images/icons/tick.svg") center center no-repeat;
        }

        input[type="checkbox"]:checked::before {
          color: ${theme.colors.white};
          display: block;
          transform: scale(1);
          transition: transform 0.2s ease-out;
        }

        select {
          appearance: none;
          background: ${theme.backgroundWhite} url("../static/images/icons/arrow-down.svg") no-repeat;
          background-position: center right 1em;
          background-size: 15px;
          padding: 10px 35px 10px 15px;
          border-radius: ${theme.borderRadius};
        }

        select:focus {
          outline: none;
        }

        label,
        legend {
          display: block;
          margin-bottom: 0.5em;
          color: ${theme.colors.almostBlack};
        }

        fieldset {
          border: none;
          margin: 0;
          padding: 0;
          width: 100%;
        }
    `}</style>
  </Fragment>
)

export default MainStyle
