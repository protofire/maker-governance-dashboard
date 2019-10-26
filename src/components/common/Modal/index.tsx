import React from 'react'
import * as ReactModal from 'react-modal'
import { theme } from '../../../theme/globalStyle'

ReactModal.setAppElement('#root')

type Props = {
  isOpen: Boolean
  isChart?: Boolean
  closeModal: Function
  children: React.ReactNode
}

function Modal(props: Props) {
  const { isOpen, closeModal, children, isChart } = props

  return (
    <>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick={false}
        style={isChart ? theme.modalStyle : { content: { bottom: 'none' } }}
      >
        {children}
      </ReactModal>
    </>
  )
}

export default Modal
