'use client'

import styled, { css } from 'styled-components'

export const BadgeWrapper = styled.div`
    font-size: 0.6em;
    float: right;
    margin: 0.5em;
`

export const BadgeStyled = styled.div`
  --size: 3.75em;
  --border-size: 0.35em;

  --color-gradient-from: #aaa;
  --color-gradient-to: #ddd;
  --color: #ccc;
  --color-contrast: #222;

  &.green {
    --color-gradient-from: var(--background-contrast-success-hover);
    --color-gradient-to: var(--background-contrast-success);
    --color: var(--background-contrast-success-active);
    --color-contrast: var(--text-default-success);
  }

  position: relative;
  font-size: 1em;
  margin: 0em 1.6em;
  width: 4em;
  height: 6.2em;
  border-radius: 10px;
  display: inline-block;
  top: 0;
  background: linear-gradient(to bottom right, var(--color-gradient-from) 0%, var(--color-gradient-to) 100%);
  color: var(--color);

  &:before,
  &:after {
    position: absolute;
    width: inherit;
    height: inherit;
    border-radius: inherit;
    background: inherit;
    content: "";
    inset: 0;
    margin: auto;
  }

  &:before {
    transform: rotate(60deg);
  }

  &:after {
  transform: rotate(-60deg);
  }

  .circle {
    width: calc(var(--size) + var(--border-size));
    height: calc(var(--size) + var(--border-size));
    position: absolute;
    background: #fff;
    z-index: 10;
    border-radius: 50%;
    border: var(--border-size) solid var(--color-contrast);

    display: flex;
    align-items: center;
    justify-content: center;

    inset: 0;
    margin: auto;

    i {
      font-size: 2.25em;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;

      &::before {
        flex: 0 0 auto;
        display: inline-block;
        vertical-align: calc((0.75em - var(--icon-size))* 0.5);
        background-color: currentColor;
        width: 80%;
        height: 100%;
        -webkit-mask-size: 100% 100%;
        mask-size: 100% 100%;
      }
      &::after {}
    }
  }

  .font {
    display: inline-block;
    margin-top: 1em;
  }

  .ribbon {
    position: absolute;
    border-radius: 0.35em;
    padding: 0.5em;
    z-index: 11;
    color: #fff;
    bottom: 0.8em;
    left: -2.25em;
    right: -2.25em;
    text-align: center;
    height: 2.25em;
    font-size: 0.6em;
    font-weight: 700;
    text-transform: uppercase;
    box-shadow: 0 0 1.3em -0.5em rgba(0,0,0,0.27);
    background-color: var(--color-gradient-to);
    background-image: linear-gradient(to bottom, var(--color-gradient-from) 0%, transparent 70%);
    color: var(--color-contrast);
    cursor: default;

    span {
      font-size: 1.5em;
      line-height: 1;
    }
  }
`

export const AddressLabelWrapper = styled.div<{ $isCertified: boolean }>`
  position: relative;
  display: block;
  flex: 1;
  font-size: 1rem;

  &::after {
    content: '';
    display: block;
    height: 0;
    clear: both;
  }
`

export const AddressNumber = styled.span`
  font-size: 1.55em;
  line-height: 1;
  font-weight: 300;
`
export const AddressNumberSuffix = styled.span`
  font-size: 0.75em;
  vertical-align: top;
  margin-left: 0.15em;
`

export const AddressMicroTopoLabel = styled.span<{ $isOnNewLine: boolean }>`
  font-size: 1em;
  ${({ $isOnNewLine }) => $isOnNewLine && css`display: block;`}
`

export const AddressParentsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
`

export const AddressParents = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

export const AddressCertification = styled.div`
  align-self: flex-end;
  justify-self: flex-end;
`

interface BadgeProps {
  label: string
  color: string
  title: string
}

export const Badge = ({ label, color, title }: BadgeProps) => {
  return (
    <BadgeWrapper title={title}>
      <BadgeStyled className={`badge ${color}`}>
        <div className="circle"><i className="ri-checkbox-circle-fill"></i></div>
        <div className="ribbon"><span>{label}</span></div>
      </BadgeStyled>
    </BadgeWrapper>
  )
}
