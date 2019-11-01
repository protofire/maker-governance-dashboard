import React from 'react'
import { StrippedRowsContainer, CardTitle, ViewAll } from '..'
import { getIconContainer } from '../../../utils'
import styled from 'styled-components'

const TitleWrapper = styled.div`
  flex-grow: 0;
  flex-shrink: 1;
  min-height: 0;
  padding: ${props => props.theme.cards.paddingVertical} ${props => props.theme.cards.paddingHorizontal} 0
    ${props => props.theme.cards.paddingHorizontal};
`

const Right = styled.div`
  margin-left: auto;
`

type Props = {
  children: React.ReactNode
  content: string
  handleModal?: () => void
  isModalOpen?: boolean
}

function StrippedTableWrapper(props: Props) {
  const { handleModal, children, content, isModalOpen } = props

  return (
    <>
      <TitleWrapper>
        <CardTitle content={content}>
          <Right>
            {handleModal ? getIconContainer(() => <ViewAll>View All</ViewAll>, handleModal, isModalOpen) : null}
          </Right>
        </CardTitle>
      </TitleWrapper>
      <StrippedRowsContainer>{children}</StrippedRowsContainer>
    </>
  )
}

export default StrippedTableWrapper
