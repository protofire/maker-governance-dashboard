import React from 'react'
import styled from 'styled-components'
import { Table } from '../common/'

const ListContainer = styled.div``

type Props = {
  columns: Array<any>
  data: Array<any>
  handleRow?: (row: any) => void
}
function List(props: Props) {
  const { data, columns, handleRow } = props
  return (
    <ListContainer>
      <Table handleRow={handleRow} expanded data={data} columns={columns} />
    </ListContainer>
  )
}

export default List
