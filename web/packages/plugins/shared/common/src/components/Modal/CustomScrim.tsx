import { Dialog, Icon, Scrim } from '@equinor/eds-core-react'
import React from 'react'
import styled from 'styled-components'

const ClickableIcon = styled.div`
  &:hover {
    color: gray;
    cursor: pointer;
  }
`

export const CustomScrim = (props: {
  closeScrim: () => void
  isOpen: boolean
  children: any
  header: string
  width?: string
  height?: string
}) => {
  const { closeScrim, isOpen, children, header, width, height } = props
  return (
    <Scrim
      isDismissable
      open={isOpen}
      onClose={closeScrim}
      style={{ zIndex: 3 }}
    >
      <Dialog
        open={true}
        style={{
          width: width ? width : '100%',
          height: height ? height : '100%',
          overflow: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderBottom: '#E6E6E6 1px solid',
              paddingTop: '10px',
            }}
          >
            <h3 style={{ paddingLeft: '20px' }}>{header}</h3>
            <ClickableIcon
              style={{
                float: 'right',
                paddingRight: '20px',
              }}
              onClick={closeScrim}
            >
              <Icon name="close" size={24} title="Close" />
            </ClickableIcon>
          </div>
          <div
            style={{
              padding: '20px 30px 30px 30px',
              alignItems: 'center',
            }}
          >
            {children}
          </div>
        </div>
      </Dialog>
    </Scrim>
  )
}
