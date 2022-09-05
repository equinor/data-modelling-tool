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
  /** Whether the Dialog is open or not */
  isOpen: boolean
  /** Child components to display inside the Dialog */
  children: any
  /** The title of the Dialog window */
  header: string
  /** The width of the Dialog window */
  width?: string
  /** The height of the Dialog window */
  height?: string
}

/**
 * Component which renders a Dialogue in a pop-up
 *
 * @docs Components
 * @scope Dialog
 *
 * @usage
 * Code example:
 * ```
 * () => {
 *   const [isOpen, setIsOpen] = React.useState(0);
 *   return (
 *     <>
 *       <button onClick={() => setIsOpen(1)}>Show</button>
 *        <Dialog
 *          isOpen={isOpen}
 *          header={'The header'}
 *          closeScrim={() => setIsOpen(0)}>
 *            Some content
 *        </Dialog>
 *    </>
 *   )
 * }
 * ```
 *
 * @param {Props} props {@link Props}
 * @returns A React component
 */
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
