// @ts-nocheck

import React from 'react'
import styled from 'styled-components'

/*
 * This component is gotten from https://javascript.plainenglish.io/architecting-and-making-a-modal-with-react-75bf652ccc70
 */

const ModalWrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 4rem 0;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.4);
`

const ModalHeader = styled.div`
  margin-bottom: 20px;
`

const ModalBody = styled.div`
  background-color: white;
  max-width: 600px;
  padding: 2rem;
  margin: 0 auto;
  border-radius: 1rem;
  border-color: #888;
`

const ModalExit = styled.div`
  float: right;
  font-size: 32px;
  font-weight: bold;

  &:hover,
  &:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
  }
`

const ModalContext = React.createContext({
  content: null,
  closeModal: () => null,
  open: false,
  // eslint-disable-next-line
  openModal: (content: any, data: any) => null,
  data: {},
})

const ModalInner = ({
  data,
  ModalContent,
}: {
  data: any
  ModalContent: any
}) => {
  return (
    <>
      <ModalHeader>
        <h2>{data.dialog.title}</h2>
      </ModalHeader>
      <ModalContent {...data.props} />
    </>
  )
}

const Modal = ({ data }: { data: any }) => {
  const { closeModal, content: ModalContent } = useModalContext()
  if (!ModalContent) {
    return null
  }
  return (
    <ModalBody>
      <ModalExit onClick={closeModal}>&times;</ModalExit>
      <ModalInner data={data} ModalContent={ModalContent} />
    </ModalBody>
  )
}

export const useModalContext = () => {
  return React.useContext(ModalContext)
}

export const ModalProvider = ({ children }: { children: any }) => {
  const [{ open, content, data }, setContent] = React.useState({
    open: false,
    content: () => ({}),
    data: {
      dialog: {
        title: '',
      },
      props: {},
    },
  })

  return (
    <ModalContext.Provider
      value={{
        open,
        content,
        openModal: (content, data) => {
          setContent({ open: true, content, data })
        },
        closeModal: () => {
          setContent((state) => ({ ...state, open: false }))

          setTimeout(() => {
            setContent((state) => ({ ...state, content: null }))
          }, 500)
        },
      }}
    >
      {open && (
        <ModalWrapper>
          <Modal data={data} />
        </ModalWrapper>
      )}
      {children}
    </ModalContext.Provider>
  )
}
