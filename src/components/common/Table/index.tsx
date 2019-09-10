import React from 'react'
import { useTable } from 'react-table'
import styled, { css } from 'styled-components'

type TableProps = {
  columns: Array<any>
  data: Array<any>
  expanded?: boolean
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
`

const RowsSection = styled.div`
  ${TableSection} {
    border-top:  ${props => (props.expanded ? '1px solid #f3f3f3' : 'none')}
    border-bottom:  ${props => (props.expanded ? '1px solid #f3f3f3' : 'none')}
    &:nth-child(odd) {
      background-color: ${props => (props.expanded ? 'white' : '#fafafa')};
    }
  }
`
const HeaderRow = styled.span`
  font-size: 12px;
  color: #999999;
`

function Table({ columns, data, expanded }: TableProps) {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  })

  // Render the UI for your table
  return (
    <TableWrapper expanded={expanded} {...getTableProps()}>
      <div>
        {headerGroups.map(headerGroup => (
          <TableSection expanded={expanded} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <HeaderRow {...column.getHeaderProps()}>{column.render('Header')}</HeaderRow>
            ))}
          </TableSection>
        ))}
      </div>
      <RowsSection expanded={expanded}>
        {rows.map(
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
  )
}

export default Table
