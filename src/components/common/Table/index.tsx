import React from 'react'
import { useTable } from 'react-table'
import styled from 'styled-components'

type TableProps = {
  columns: Array<any>
  data: Array<any>
}

const TableWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`
const TableSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1rem;
  &:nth-child(odd) {
    background-color: #fafafa;
  }
`
const HeaderRow = styled.span`
  font-size: 12px;
  color: #999999;
`

const TableRow = styled.span`
  font-size: 13px;
  color: #000000;
`

function Table({ columns, data }: TableProps) {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  })

  // Render the UI for your table
  return (
    <TableWrapper {...getTableProps()}>
      <div>
        {headerGroups.map(headerGroup => (
          <TableSection {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <HeaderRow {...column.getHeaderProps()}>{column.render('Header')}</HeaderRow>
            ))}
          </TableSection>
        ))}
      </div>
      <div>
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
      </div>
    </TableWrapper>
  )
}

export default Table
