import React from 'react'
import styled from 'styled-components'

import List from '../../components/List'
import { Pollcolumns } from '../../components/List/helpers'

//Common components
import { PageTitle } from '../../components/common'

const PollsContainer = styled.div``

function PollsInfo() {
  const pollcolumns = React.useMemo(() => Pollcolumns(), [])

  return (
    <PollsContainer>
      <PageTitle>Polling</PageTitle>
      <List data={[]} columns={pollcolumns} />
    </PollsContainer>
  )
}

export default PollsInfo
