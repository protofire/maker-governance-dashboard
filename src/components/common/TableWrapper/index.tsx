import React from 'react'
import { StrippedRowsContainer, CardTitle, ViewAll } from '../../common'
import { getIconContainer } from '../../../utils'
import styled from 'styled-components'

const Right = styled.div`
  margin-left: auto;
`

type Props = {
  children: React.ReactNode
  content: string
  handleModal?: () => void
  isModalOpen?: boolean
}

function TableWrapper(props: Props) {
  const { handleModal, children, content, isModalOpen } = props

  return (
    <>
      <CardTitle content={content}>
        <Right>
          {handleModal ? getIconContainer(() => <ViewAll>View All</ViewAll>, handleModal, isModalOpen) : null}
        </Right>
      </CardTitle>
      <StrippedRowsContainer>{children}</StrippedRowsContainer>
    </>
  )
}

export default TableWrapper
