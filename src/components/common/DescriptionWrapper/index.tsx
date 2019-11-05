import React from 'react'
import styled from 'styled-components'
import { ViewAll, CardTitle } from '../../common'
import { getIconContainer } from '../../../utils'

type Props = {
  handleModal: () => void
  content: string
  children: React.ReactNode
  isModalOpen: boolean
}

const Right = styled.div`
  margin-left: auto;
`

const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  font-size: 13px;
  justify-content: space-between;
  position: relative;
`

function DescriptionWrapper(props: Props) {
  const { handleModal, children, content, isModalOpen } = props

  return (
    <>
      <DescriptionContainer isModalOpen={isModalOpen}>
        <CardTitle content={content}>
          <Right>
            {getIconContainer(
              () => (
                <ViewAll>View More</ViewAll>
              ),
              handleModal,
              isModalOpen,
            )}
          </Right>
        </CardTitle>
      </DescriptionContainer>
      {children}
    </>
  )
}

export default DescriptionWrapper
