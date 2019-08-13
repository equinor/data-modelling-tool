import React from 'react'
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'
import './react-contextmenu.css'
import './custom.css'

const attributes = {
  className: 'custom-root',
  // remove warnings by comment out the following
  // disabledClassName: 'custom-disabled',
  // dividerClassName: 'custom-divider',
  // selectedClassName: 'custom-selected',
}

/**
 * id: unique id for the context menu.
 * menuItems: [
 * 	{
 * 		action: 'copy|paste|your-action
 * 		onClick: callback
 * 	}
 * ]
 *
 * @param props
 * @constructor
 */

export default (props: any) => {
  const { id, menuItems, onClickContextMenu } = props
  return (
    <span style={{ fontFamily: 'sans-serif' }}>
      <div>
        <ContextMenuTrigger id={id}>{props.children}</ContextMenuTrigger>
      </div>
      <ContextMenu id={id}>
        {menuItems.map((menuItem: any, index: number) => {
          if (Object.keys(menuItem).length === 0) {
            return <MenuItem divider />
          } else {
            return (
              <MenuItem
                key={'menuitem' + index + id}
                data={{ action: menuItem.action }}
                onClick={() => {
                  onClickContextMenu(id, menuItem.action)
                }}
                attributes={attributes}
              >
                {menuItem.label}
              </MenuItem>
            )
          }
        })}
      </ContextMenu>
    </span>
  )
}
