'use client'

import styled from 'styled-components'
import Tag from "@codegouvfr/react-dsfr/Tag"

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1px;
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

export const EmptyMessage = styled.p`
  padding: 2rem;
  text-align: center;
  color: #666;
  font-style: italic;
`;

export const Item = styled.div`
  background: #fff;
  padding: 1.5rem 1.5rem 1.5rem 0rem;
  display: grid;
  grid-template-columns: 1fr 4fr 2fr 1fr;
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

export const MonthsNav = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
`;

export const MonthButton = styled.button<{ $active?: boolean }>`
  border: none;
  background: none;
  padding: 1.25rem 0.5rem;
  font-size: 0.95rem;
  color: ${({ $active }) => ($active ? "#6a6af4" : "#3a3a3a")};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  cursor: pointer;
  white-space: nowrap;
  text-align: center;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background: ${({ $active }) => ($active ? "#6a6af4" : "transparent")};
  }

  &:hover {
    color: #6a6af4;
  }
`;

export const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const StyledTag = styled(Tag)`
  background-color: #fff !important;
  border: 1px solid #000091 !important; /* bleu DSFR, ajustez selon votre charte */
  color: #000091 !important;
`;