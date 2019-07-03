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

const App = props => {
  const { id, menuItems } = props
  return (
    <span style={{ fontFamily: 'sans-serif' }}>
      <ContextMenuTrigger id={id} style={{ display: 'inline-block' }}>
        {props.children}
      </ContextMenuTrigger>
      <ContextMenu id={id}>
        {menuItems.map((menuItem, index) => {
          if (Object.keys(menuItem).length === 0) {
            return <MenuItem divider />
          } else {
            return (
              <MenuItem
                key={'menuitem' + index + id}
                data={{ action: menuItem.action }}
                onClick={menuItem.onClick}
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

export default App
