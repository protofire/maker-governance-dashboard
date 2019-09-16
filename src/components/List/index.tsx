import React from 'react'
import styled from 'styled-components'
import { Table } from '../common/'

const ListContainer = styled.div``

type Props = {
  columns: Array<any>
  data: Array<any>
}
function List(props: Props) {
  const { data, columns } = props
  return (
    <ListContainer>
      <Table expanded data={data} columns={columns} />
    </ListContainer>
  )
}

export default List
