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
  closeScrim: Function
  children: any
  header: string
  width?: string
  height?: string
}) => {
  const { closeScrim, children, header, width, height } = props
  return (
    // @ts-ignore
    <Scrim isDismissable onClose={closeScrim} style={{ zIndex: 3 }}>
      <Dialog
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
            }}
          >
            <h3 style={{ paddingLeft: '20px' }}>{header}</h3>
            <ClickableIcon
              style={{
                float: 'right',
                paddingRight: '20px',
              }}
              // @ts-ignore
              onClick={closeScrim}
            >
              <Icon name="close" size={24} title="Close" />
            </ClickableIcon>
          </div>
          <div
            style={{
              padding: '20px 30px 30px 30px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxHeight: '75vh',
            }}
          >
            {children}
          </div>
        </div>
      </Dialog>
    </Scrim>
  )
}
