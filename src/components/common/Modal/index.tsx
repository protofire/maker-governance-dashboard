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
  const { isOpen, closeModal, children } = props

  return (
    <>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick={false}
        style={theme.modalStyle}
      >
        {children}
      </ReactModal>
    </>
  )
}

export default Modal
