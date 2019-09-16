import React from 'react'
import styled from 'styled-components'

import List from '../../components/List'
import { Executivecolumns } from '../../components/List/helpers'

//Common components
import { PageTitle } from '../../components/common'

const ExecutiveContainer = styled.div``

function ExecutiveInfo() {
  const executivecolumns = React.useMemo(() => Executivecolumns(), [])

  return (
    <ExecutiveContainer>
      <PageTitle>Executive Votes</PageTitle>
      <List data={[]} columns={executivecolumns} />
    </ExecutiveContainer>
  )
}

export default ExecutiveInfo
