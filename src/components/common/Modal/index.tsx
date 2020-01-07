import React from 'react'
import * as ReactModal from 'react-modal'
import { theme } from '../../../theme/globalStyle'

ReactModal.setAppElement('#root')

type Props = {
  isOpen: Boolean
  isChart?: Boolean
  closeModal: Function
  children: React.ReactNode
  styles?: object
}

function Modal(props: Props) {
  const { isOpen, closeModal, children, styles } = props

  return (
    <>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick={true}
        style={styles ? { ...theme.modalStyle, ...styles } : theme.modalStyle}
      >
        {children}
      </ReactModal>
    </>
  )
}

export default Modal
