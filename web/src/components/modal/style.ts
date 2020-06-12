import styled from 'styled-components'

const ModalWrapper = styled.div`
  position: fixed;
  z-index: 1;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
`

const ModalHeader = styled.div`
  margin-bottom: 20px;
`

const ModalBody = styled.div`
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  // @ts-ignore
  width: ${props => props.width || '30%'};
  min-width: 300px;
`

const CloseButton = styled.span`
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;

  &:hover,
  &:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
  }
`

export const StyledModal = {
  ModalWrapper,
  ModalBody,
  CloseButton,
  ModalHeader,
}
