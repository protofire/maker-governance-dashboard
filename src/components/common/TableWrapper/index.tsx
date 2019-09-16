import React from 'react'
import { TableContainer, TableTitle, TitleContainer, ViewAll } from '../../common'
import { getIconContainer } from '../../../utils'
type Props = {
  handleModal: () => void
  content: string
  children: React.ReactNode
  isModalOpen: boolean
}

function TableWrapper(props: Props) {
  const { handleModal, children, content, isModalOpen } = props

  return (
    <TableContainer>
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
      {children}
    </TableContainer>
  )
}

export default TableWrapper
