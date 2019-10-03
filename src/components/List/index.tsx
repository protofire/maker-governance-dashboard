import React from 'react'
import styled from 'styled-components'
import { Table } from '../common/'

const ListContainer = styled.div``

interface SortBy {
  id: string
  desc: Boolean
}

type Props = {
  columns: Array<any>
  data: Array<any>
  sortBy?: SortBy[]
  handleRow?: (row: any) => void
}

function List(props: Props) {
  const { data, columns, handleRow, sortBy } = props
  return (
    <ListContainer>
      <Table handleRow={handleRow} expanded data={data} columns={columns} sortBy={sortBy} />
    </ListContainer>
  )
}

export default List
