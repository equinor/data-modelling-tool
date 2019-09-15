// https://wecodetheweb.com/2019/03/02/easy-modals-with-react-hooks/
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { StyledModal } from './style'

// Creates a portal outside the DOM hierarchy
function Portal(props: any) {
  const { children } = props
  const modalRoot = document.getElementById('modal-root') // A div with id=modal-root in the index.html
  const [element] = useState(document.createElement('div')) // Create a div element which will be mounted within modal-root

  // useEffect bible: https://overreacted.io/a-complete-guide-to-useeffect/
  useEffect(() => {
    if (modalRoot) {
      modalRoot.appendChild(element)
    }

    // cleanup method to remove the appended child
    return function cleanup() {
      if (modalRoot) {
        modalRoot.removeChild(element)
      }
    }
  }, [modalRoot, element])

  return createPortal(children, element)
}

// A modal component which will be used by other components / pages
function Modal(props: any) {
  const { children, toggle, open, title } = props
  return (
    <Portal>
      {open && (
        <StyledModal.ModalWrapper onClick={toggle}>
          <StyledModal.ModalBody onClick={event => event.stopPropagation()}>
            <StyledModal.CloseButton onClick={toggle}>
              &times;
            </StyledModal.CloseButton>
            <StyledModal.ModalHeader>
              <h4>{title}</h4>
            </StyledModal.ModalHeader>
            {children}
          </StyledModal.ModalBody>
        </StyledModal.ModalWrapper>
      )}
    </Portal>
  )
}

export default Modal
