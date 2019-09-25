import React from 'react'
import styled from 'styled-components'
import { ViewAll } from '../../common'
import { getIconContainer } from '../../../utils'
type Props = {
  handleModal: () => void
  content: string
  children: React.ReactNode
  isModalOpen: boolean
}

const DescriptionContainer = styled.div`
  font-size: 13px;
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  bottom: 6px;
`

const DescriptionText = styled.span``

function DescriptionWrapper(props: Props) {
  const { handleModal, children, content, isModalOpen } = props

  return (
    <>
      <DescriptionContainer>
        <DescriptionText>{content}</DescriptionText>
        {getIconContainer(
          () => (
            <ViewAll>View More</ViewAll>
          ),
          handleModal,
          isModalOpen,
        )}
      </DescriptionContainer>
      {children}
    </>
  )
}

export default DescriptionWrapper
