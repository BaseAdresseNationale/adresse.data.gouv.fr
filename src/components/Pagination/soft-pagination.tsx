import Pagination from 'react-js-pagination'
import styled from 'styled-components'

interface ReactPaginationProps {
  currentPage: number
  totalCount: number
  onPageChange: (value: number) => void
  limit: number
}

const StyledWrapper = styled.div`
  .current-page {
    background-color: grey;
  }
`

export default function SoftPagination({ currentPage, totalCount, onPageChange, limit }: ReactPaginationProps) {
  return (
    <StyledWrapper>
      <div className="pagination fr-mx-auto fr-my-2w">
        <nav
          role="navigation"
          className="fr-pagination"
          aria-label="Pagination"
        >
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={limit}
            totalItemsCount={totalCount}
            pageRangeDisplayed={5}
            onChange={onPageChange}
            innerClass="fr-pagination__list"
            activeLinkClass="current-page"
            linkClass="fr-pagination__link"
            linkClassFirst="fr-pagination__link--first"
            linkClassPrev="fr-pagination__link--prev"
            linkClassNext="fr-pagination__link--next"
            linkClassLast="fr-pagination__link--last"
          />
        </nav>
      </div>
    </StyledWrapper>
  )
}
