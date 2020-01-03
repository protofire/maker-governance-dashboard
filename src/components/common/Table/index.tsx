import React, { useState, useEffect, useRef } from 'react'
import { useTable, useTableState, usePagination, useSortBy, useFilters } from 'react-table'
import styled, { css } from 'styled-components'
import { DefaultColumnFilter, fuzzyTextFilterFn } from './filters'
import { NextIcon, PreviousIcon, ArrowIcon, FilterIcon, HatIcon } from '../Icon'

import { IconContainer, Select } from '../styled'
import { theme } from '../../../theme/globalStyle'

interface SortBy {
  desc: Boolean
  id: string
}

type TableProps = {
  columns?: Array<any>
  data?: Array<any>
  expanded?: boolean
  handleRow?: (row: any) => void
  limitPerPage?: number
  scrollable?: boolean
  sortBy?: SortBy[]
}

const HatContainer = styled.span`
  position: absolute;
  height: 51px;
  width: 24px;
  top: 0;
  left: 0;
  background: #333;
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const HatIconContainer = styled(HatIcon)`
  position: relative;
  top: 1px;
  left: 4px;
`

const FilterContainer = styled.div`
  margin-top: 10px;
  position: absolute;
`
const FilterIconContainer = styled.span`
  cursor: pointer;
  left: 9px;
  position: relative;
  width: 30px;
`
const TableRow = styled.span`
  font-size: 13px;
  color: #000;
  ${props =>
    props.hat &&
    css`
      position: relative;
    `}
  border-right: ${props => (props.separator ? '1px solid #f3f3f3' : 'none')};
  @media (min-width: ${theme.themeBreakPoints.sm}) {
    ${props =>
      props.width &&
      css`
        flex: none !important;
        width: ${props.width}px !important;
      `}
  }
`

const HeaderRow = styled.span`
  color: ${props => props.theme.colors.textLight};
  font-size: 12px;
  div:first-child {
    display: flex;
    flex-direction: row;
    flex: 1;
    margin-left: ${props => (props.hat ? '20px' : '0')};
  }
  border-right: ${props => (props.separator ? '1px solid #f3f3f3' : 'none')};

  @media (min-width: 480px) {
    ${props =>
      props.width &&
      css`
        flex: none !important;
        width: ${props.width}px !important;
      `}
  }
`

const TableSection = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`

const ResponsiveWrapper = styled.div`
  *,
  &::after,
  &:before {
    box-sizing: initial;
  }
  overflow-x: auto;
  width: 100%;
`

const TableWrapper = styled.div`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 100%;
  width: fit-content !important;

  ${FilterContainer},${FilterIconContainer} {
    ${props =>
      !props.expanded &&
      css`
        display: none;
      `}
  }

  ${TableSection} {
    ${TableRow}, ${HeaderRow} {
      padding: 16px 20px;
    }
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
          }
        `
      }
    }}

    ${TableRow}:first-child {
      ${props =>
        !props.expanded &&
        css`
          display: flex;
          max-width: 250px;
        `}
      a {
        ${props =>
          !props.expanded &&
          css`
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
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
      cursor: ${props => (props.mouseActive ? 'pointer' : 'auto')};
      ${props =>
        props.expanded &&
        css`
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
  @media (max-width: ${props => props.theme.themeBreakPoints.sm}) {
    overflow: initial;
  }
`

const ArrowSort = styled(({ up, hidden, ...props }) => <ArrowIcon {...props} />)`
  left: 5px;
  position: relative;
  transform: ${props => (props.up ? 'rotate(180deg)' : 'rotate(0deg)')};
  visibility: ${props => (props.hidden ? 'hidden' : 'visible')};
`

const Pagination = styled.div`
  * {
    font-size: 12px;
    color: #666;
  }
  align-items: center;
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: flex-end;
  margin-top: 10px;
  padding: 1rem;
`
const PageIconContainer = styled(IconContainer)`
  margin-left: 1rem;
`

const PageSelect = styled(Select)``

const Pager = styled.span`
  margin-right: 1rem;
`
const setInitialFilters = columns => {
  return columns.reduce((accum, column) => {
    if (!column.disableFilters) {
      return {
        ...accum,
        [column.Header]: false,
      }
    } else return { ...accum }
  }, {})
}

// Let the table remove the filter if the string is empty
// @ts-ignore
fuzzyTextFilterFn.autoRemove = val => !val

function Table({ columns, data, expanded, limitPerPage, scrollable, handleRow, sortBy }: TableProps) {
  const [filters, setFilters] = useState(setInitialFilters(columns))

  const handleFn = handleRow ? handleRow : () => {}
  const mouseActive = !!handleRow
  const pageData = {
    ...(limitPerPage && { limitPerPage }),
    ...(sortBy && { sortBy }),
  }
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
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
  const filterNode = useRef()
  const itemsRef = useRef([])
  // you can access the elements with itemsRef.current[n]

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, filters.length)
  }, [filters])

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
    state: [{ pageIndex, pageSize, ...otherState }],
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

  useEffect(() => {
    const handleClick = e => {
      if (!filterNode.current) return
      // @ts-ignore
      const tapIcon = itemsRef.current.find(el => el && el.contains(e.target))
      // @ts-ignore
      if (!filterNode.current.contains(e.target) && !tapIcon) setFilters(setInitialFilters(columns))
    }
    // add when mounted
    document.addEventListener('mousedown', handleClick)
    // return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [columns])

  useEffect(() => {
    if (Object.keys(otherState.filters)) setFilters(setInitialFilters(columns))
    else {
      const cleanFilters = Object.keys(otherState.filters).reduce(
        (accum, filterKey) => ({
          ...accum,
          [filterKey]: false,
        }),
        {},
      )
      setFilters(current => ({ ...current, ...cleanFilters }))
    }
  }, [columns, otherState.filters])

  const isFiltered = filter =>
    Object.keys(otherState.filters)
      .map(e => e.toLowerCase())
      .includes(filter.toLowerCase())

  // Render the UI for your table
  return (
    <ResponsiveWrapper>
      <TableWrapper scrollable={scrollable} expanded={expanded} {...getTableProps()}>
        {headerGroups.map(headerGroup => (
          <TableSection expanded={expanded} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, i) => (
              <HeaderRow hat={column.hat} key={column.id} width={column.width} separator={column.separator}>
                <div>
                  <span {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <ArrowSort up={false} />
                      ) : (
                        <ArrowSort up={true} />
                      )
                    ) : (
                      <ArrowSort hidden />
                    )}
                  </span>
                  {column.canFilter && (
                    <FilterIconContainer
                      ref={(el: never) => (itemsRef.current[i] = el)}
                      onClick={() => setFilters(current => ({ ...current, [column.Header]: !current[column.Header] }))}
                    >
                      <FilterIcon selected={isFiltered(column.Header)} />
                    </FilterIconContainer>
                  )}
                </div>
                {filters[column.Header] && (
                  <FilterContainer ref={filterNode}>{column.render('Filter')}</FilterContainer>
                )}
              </HeaderRow>
            ))}
          </TableSection>
        ))}
        <RowsSection mouseActive={mouseActive} scrollable={scrollable} expanded={expanded}>
          {page.map(
            row =>
              prepareRow(row) || (
                <TableSection onClick={() => handleFn(row.original)} {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <TableRow
                        hat={cell.row.original.isHat && cell.column.Header === 'Status'}
                        width={cell.column.width}
                        separator={cell.column.separator}
                        {...cell.getCellProps()}
                      >
                        {cell.row.original.isHat && cell.column.Header === 'Status' && (
                          <HatContainer>
                            <HatIconContainer />
                          </HatContainer>
                        )}
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
    </ResponsiveWrapper>
  )
}

export default Table
