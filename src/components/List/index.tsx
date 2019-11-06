import React from 'react'
import styled from 'styled-components'
import { Card, Table } from '../common/'

const CardStyled = styled(Card)`
  padding: 0;
`

interface SortBy {
  id: string
  desc: Boolean
}

type Props = {
  columns: Array<any>
  data: Array<any>
  sortBy?: SortBy[]
  isExecutive?: boolean
  handleRow?: (row: any) => void
}

function List(props: Props) {
  const { data, columns, handleRow, sortBy, isExecutive } = props
  return (
    <CardStyled>
      <Table isExecutive={isExecutive} handleRow={handleRow} expanded data={data} columns={columns} sortBy={sortBy} />
    </CardStyled>
  )
}

export default List
