import { Dialog, Icon, Scrim } from '@equinor/eds-core-react'
import { ClickableIcon } from './App/Header'
import React, { ReactChildren } from 'react'

export const CustomScrim = (props: {
  closeScrim: Function
  children: any
  header: string
  width?: number
}) => {
  const { closeScrim, children, header, width } = props
  return (
    <Scrim isDismissable onClose={closeScrim}>
      <Dialog style={{ width: width ? width : '100%' }}>
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
            onClick={closeScrim}
          >
            <Icon name="close" size={24} title="Close" />
          </ClickableIcon>
        </div>
        <div style={{ padding: '20px 30px 30px 30px' }}>{children}</div>
      </Dialog>
    </Scrim>
  )
}
