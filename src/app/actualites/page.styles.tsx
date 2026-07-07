'use client'

import styled from 'styled-components'


export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1px;
  background-color: #ddd;
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

export const Item = styled.div`
  background: #fff;
  padding: 1.5rem 1.5rem 1.5rem 0rem;
  display: grid;
  grid-template-columns: 1fr 4fr 2fr 2fr;
  gap: 1rem;
  align-items: start;
`;


export const MonthLabel = styled.h4`
  background: #fff;
  margin: 0;
  padding: 1rem 0 0.5rem;
  textTransform: "capitalize"
`;

export const DateBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  line-height: 1.2;

  .day {
    font-size: 1.75rem;
    font-weight: 700;
  }

  .month {
    font-size: 0.85rem;
    text-transform: capitalize;
  }

  .year {
    font-size: 0.75rem;
    color: #666;
  }
`;