import React from 'react'
import { TableContainer, TableTitle, TitleContainer, ViewAll } from '../../common'
import { getIconContainer } from '../../../utils'

type Props = {
  children: React.ReactNode
  content: string
  handleModal: () => void
  isModalOpen: boolean
}

function TableWrapper(props: Props) {
  const { handleModal, children, content, isModalOpen } = props

  return (
    <>
      <TitleContainer>
        <TableTitle>{content}</TableTitle>
        {getIconContainer(
          () => (
            <ViewAll>View All</ViewAll>
          ),
          handleModal,
          isModalOpen,
        )}
      </TitleContainer>
      <TableContainer>{children}</TableContainer>
    </>
  )
}

export default TableWrapper
