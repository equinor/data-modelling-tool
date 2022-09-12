import { Dialog as EdsDialog, Icon } from '@equinor/eds-core-react'
import React from 'react'
import styled from 'styled-components'
import { close } from '@equinor/eds-icons'

Icon.add({
  close,
})

const ClickableIcon = styled.div`
  &:hover {
    color: gray;
    cursor: pointer;
  }
`

export interface Props {
  /** Provides a url for avatars being used as a link. */
  closeScrim: () => void
  isOpen: boolean
  children: any
  header: string
  width?: string
  height?: string
}

export const Dialog = (props: Props) => {
  const { closeScrim, isOpen, children, header, width, height } = props
  return (
    <EdsDialog
      // @ts-ignore
      isDismissable
      open={isOpen}
      onClose={closeScrim}
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
        {children}
      </div>
    </EdsDialog>
  )
}
