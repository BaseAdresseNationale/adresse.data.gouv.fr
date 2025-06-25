'use client'

import styled from 'styled-components'

export const PopupWrapper = styled.div`
  margin: .5rem 0;
  width: 280px;

  .heading {
    align-items: flex-start;
    margin: .5rem 0;
  }

  .addr-num {
    font-weight: 300;
    font-size: 1.5em;
    line-height: 1;

    &.with-suffix {
      display: block;
    }

    .addr-num-suffix {
      font-size: .75em;
      vertical-align: top;
      margin-left: .15em;
    }
}
  .addr-main-topo {
    font-weight: 700;
  }
  .addr-secondary-topo {
    font-weight: 300;
    font-size: .8em;
  }
  .addr-district {
    margin-top: .25em;
    font-weight: 500;
    font-size: .9em;

    .addr-district-prefix {
      display: block;
      font-weight: 300;
      font-size: .8em;
      line-height: 1.25;
    }

    .addr-district-cog-prefix {
      font-size: 0.8em;
      letter-spacing: 0.05em;
    }
  }

  .infos-container {
    display: grid;
    grid-template-columns: 10px 1fr;
    margin-top: 2em;
  }

  .separator {
    width: 0px;
    border: 1px solid var(--text-action-high-blue-france);
  }

  .infos {
    display: grid;
    align-items: center;
    grid-template-rows: 1fr 1fr;
  }
`

export const PopupVoieWrapper = styled(PopupWrapper)`
 .toponym-desc {
  display: block;
  border-top: 1px solid var(--border-plain-grey);
  margin: 0.7em 0 0;
  padding: 0.7em 0;
  font-size: .9em;
  font-weight: 300;
 }
`

export const BadgeIcon = styled.span`
  &::before {
    --icon-size: 1em;
    margin-right: .25em;
  }
`
