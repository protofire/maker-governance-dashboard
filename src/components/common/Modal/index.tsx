import React from 'react'
import * as ReactModal from 'react-modal'
import './index.css'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    overflowY: 'hidden',
  },
}

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
        style={isChart ? customStyles : { content: { bottom: 'none' } }}
        shouldCloseOnOverlayClick={false}
        isOpen={isOpen}
        onRequestClose={closeModal}
      >
        {children}
      </ReactModal>
    </>
  )
}

export default Modal
