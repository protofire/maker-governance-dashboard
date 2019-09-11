import React from 'react'
import { useTable, useTableState, usePagination } from 'react-table'
import styled, { css } from 'styled-components'
import { NextIcon, PreviousIcon } from '../../common'
import { IconContainer, Select } from '../styled'

type TableProps = {
  columns: Array<any>
  data: Array<any>
  expanded?: boolean
  limitPerPage?: number
  scrollable?: boolean
}

const TableRow = styled.span`
  font-size: 13px;
  color: #000000;
`

const TableSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1rem;
`

const TableWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  border: ${props => (props.expanded ? '1px solid #f3f3f3' : 'none')};
  margin-top: ${props => (props.expanded ? '1rem' : '0')};
  ${TableSection} {
    ${TableRow}:first-child {
      ${props =>
        !props.expanded &&
        css`
          display: flex;
          width: 120px;
        `}
      a {
        ${props =>
          !props.expanded &&
          css`
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          `}
      }
    }
  }
  ${props =>
    props.scrollable &&
    css`
      max-height: 400px;
      overflow: hidden;
    `}
`

const RowsSection = styled.div`
  ${TableSection} {
    border-top:  ${props => (props.expanded ? '1px solid #f3f3f3' : 'none')}
    border-bottom:  ${props => (props.expanded ? '1px solid #f3f3f3' : 'none')}
    &:nth-child(odd) {
      background-color: ${props => (props.expanded ? 'white' : '#fafafa')};
    }
  }
  overflow-y:${props => (props.scrollable ? 'scroll' : 'hidden')}
`
const HeaderRow = styled.span`
  font-size: 12px;
  color: #999999;
`

const Pagination = styled.div`
  * {
    font-size: 12px;
    color: #666666;
  }
  display: flex;
  flex: 1;
  flex-direction: row;
  margin-top: 10px;
  align-items: center;
  justify-content: flex-end;
`
const PageIconContainer = styled(IconContainer)`
  margin-left: 1rem;
`

const PageSelect = styled(Select)``

const Pager = styled.span`
  margin-right: 1rem;
`

function Table({ columns, data, expanded, limitPerPage, scrollable }: TableProps) {
  const pageData = limitPerPage ? { pageSize: limitPerPage } : {}
  const tableState = useTableState(pageData)

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page
    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    setPageSize,
    state: [{ pageIndex, pageSize }],
  } = useTable(
    {
      columns,
      data,
      state: tableState,
    },
    usePagination,
  )

  // Render the UI for your table
  return (
    <>
      <TableWrapper scrollable={scrollable} expanded={expanded} {...getTableProps()}>
        <div>
          {headerGroups.map(headerGroup => (
            <TableSection expanded={expanded} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <HeaderRow {...column.getHeaderProps()}>{column.render('Header')}</HeaderRow>
              ))}
            </TableSection>
          ))}
        </div>
        <RowsSection scrollable={scrollable} expanded={expanded}>
          {page.map(
            row =>
              prepareRow(row) || (
                <TableSection {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <TableRow {...cell.getCellProps()}>{cell.render('Cell')}</TableRow>
                  })}
                </TableSection>
              ),
          )}
        </RowsSection>
      </TableWrapper>
      {expanded && (
        <Pagination>
          <PageSelect
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value))
            }}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Rows per page: {pageSize}
              </option>
            ))}
          </PageSelect>
          <Pager>
            {pageIndex + 1}-{pageSize} of {pageOptions.length}
          </Pager>
          <PageIconContainer onClick={() => previousPage()} disabled={!canPreviousPage}>
            <PreviousIcon />
          </PageIconContainer>
          <PageIconContainer onClick={() => nextPage()} disabled={!canNextPage}>
            <NextIcon />
          </PageIconContainer>
        </Pagination>
      )}
    </>
  )
}

export default Table
