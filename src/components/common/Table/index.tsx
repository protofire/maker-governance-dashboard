import React from 'react'
import { useTable, useTableState, usePagination, useSortBy, useFilters } from 'react-table'

import styled, { css } from 'styled-components'
import { DefaultColumnFilter, fuzzyTextFilterFn } from './filters'
import { NextIcon, PreviousIcon, ArrowIcon } from '../Icon/index'
import { IconContainer, Select } from '../styled'

interface SortBy {
  id: string
  desc: Boolean
}

type TableProps = {
  columns?: Array<any>
  data?: Array<any>
  expanded?: boolean
  limitPerPage?: number
  sortBy?: SortBy[]
  handleRow?: (row: any) => void
  scrollable?: boolean
}

const FilterContainer = styled.div`
  margin-top: 10px;
`

const TableRow = styled.span`
  font-size: 13px;
  color: #000000;
  ${props =>
    props.width &&
    css`
      flex: none !important;
      width: ${props.width}px !important;
    `}
`
const HeaderRow = styled.span`
  font-size: 12px;
  color: #999999;
  div:first-child {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
  }
  ${props =>
    props.width &&
    css`
      flex: none !important;
      width: ${props.width}px !important;
    `}
`

const TableSection = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1rem;
`

const TableWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  background-color: white;
  border: ${props => (props.expanded ? '1px solid #f3f3f3' : 'none')};
  margin-top: ${props => (props.expanded ? '1rem' : '0')};
  ${FilterContainer} {
    ${props =>
      !props.expanded &&
      css`
        display: none;
      `}
  }
  ${TableSection} {
    ${props => {
      if (!props.expanded) {
        return css`
          justify-content: space-between;
        `
      } else {
        return css`
          ${TableRow}, ${HeaderRow} {
            flex: 1;
            text-align: left;
            margin-right: 20px;
          }
        `
      }
    }}

    ${TableRow}:first-child {
      ${props =>
        !props.expanded &&
        css`
          display: flex;
          width: 200px;
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
    border-top: ${props => (props.expanded ? '1px solid #f3f3f3' : 'none')};
    border-bottom: ${props => (props.expanded ? '1px solid #f3f3f3' : 'none')};
    &:nth-child(odd) {
      background-color: ${props => (props.expanded ? 'white' : '#fafafa')};
    }
    &:hover {
      ${props =>
        props.expanded &&
        css`
          cursor: pointer;
          background-color: #fafafa;
        `}
    }
  }
  overflow-y: ${props => (props.scrollable ? 'scroll' : 'hidden')};
  ${TableRow} {
    ${props =>
      props.expanded &&
      css`
        width: 100px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `}
  }
`

const ArrowSort = styled(({ up, ...props }) => <ArrowIcon {...props} />)`
  position: relative;
  left: 5px;
  top: 1px;
  transform: ${props => (props.up ? 'rotate(180deg)' : 'rotate(0deg)')};
`

const Pagination = styled.div`
  * {
    font-size: 12px;
    color: #666666;
  }
  padding: 1rem;
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

// Let the table remove the filter if the string is empty
// @ts-ignore
fuzzyTextFilterFn.autoRemove = val => !val

function Table({ columns, data, expanded, limitPerPage, scrollable, handleRow, sortBy }: TableProps) {
  const handleFn = handleRow ? handleRow : () => {}
  const pageData = {
    ...(limitPerPage && { limitPerPage }),
    ...(sortBy && { sortBy }),
  }
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    [],
  )
  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    [],
  )

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
    nextPage,
    previousPage,
    setPageSize,
    state: [{ pageIndex, pageSize }],
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
      state: tableState,
      disableSortRemove: true,
    },
    useFilters,
    useSortBy,
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
                <HeaderRow key={column.id} width={column.width}>
                  <div {...column.getHeaderProps(column.getSortByToggleProps())}>
                    <span>
                      {column.render('Header')}
                      {column.isSorted ? column.isSortedDesc ? <ArrowSort up={false} /> : <ArrowSort up={true} /> : ''}
                    </span>
                  </div>
                  <FilterContainer>{column.canFilter ? column.render('Filter') : null}</FilterContainer>
                </HeaderRow>
              ))}
            </TableSection>
          ))}
        </div>
        <RowsSection scrollable={scrollable} expanded={expanded}>
          {page.map(
            row =>
              prepareRow(row) || (
                <TableSection onClick={() => handleFn(row.original)} {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <TableRow width={cell.column.width} {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </TableRow>
                    )
                  })}
                </TableSection>
              ),
          )}
        </RowsSection>
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
              {pageIndex + 1}-{pageSize} of {data ? data.length : 0}
            </Pager>
            <PageIconContainer onClick={() => previousPage()} disabled={!canPreviousPage}>
              <PreviousIcon />
            </PageIconContainer>
            <PageIconContainer onClick={() => nextPage()} disabled={!canNextPage}>
              <NextIcon />
            </PageIconContainer>
          </Pagination>
        )}
      </TableWrapper>
    </>
  )
}

export default Table
