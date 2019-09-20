import React from 'react'
import {
  ContextMenu,
  MenuItem,
  ContextMenuTrigger,
  SubMenu,
} from 'react-contextmenu'
import './react-contextmenu.css'
import './custom.css'
import styled from 'styled-components'

const attributes = {
  className: 'custom-root',
}

export interface MenuItem {
  action?: string
  label: string
  menuItems?: MenuItem[]
  icon?: any
}

type DmtMenuItemsProps = {
  id: string
  onClickContextMenu: Function
  menuItems: MenuItem[]
}

const renderMenuItems = (props: DmtMenuItemsProps) => {
  const { id, menuItems, onClickContextMenu } = props
  return menuItems.map((menuItem: MenuItem, index: number) => {
    const key = `menuitem-${id}-${index}`
    if (Object.keys(menuItem).length === 0) {
      return <MenuItem divider />
    } else if (menuItem.menuItems) {
      return (
        <DmtSubMenu
          id={id}
          key={key}
          onClickContextMenu={onClickContextMenu}
          menuItems={menuItem.menuItems}
          label={menuItem.label}
        />
      )
    } else {
      return (
        <DmtMenuItem
          key={key}
          id={id}
          onClickContextMenu={onClickContextMenu}
          menuItem={menuItem}
        />
      )
    }
  })
}

type DmtSubMenuProps = {
  id: string
  label: string
  menuItems: MenuItem[]
  onClickContextMenu: Function
}

const UnClickable = ({ children }: any) => (
  <span onClick={(e: any) => e.stopPropagation()}>{children}</span>
)

const DmtSubMenu = (props: DmtSubMenuProps) => {
  const { id, label, onClickContextMenu, menuItems } = props

  const menuItemsComponents = renderMenuItems({
    id,
    onClickContextMenu,
    menuItems,
  })

  return (
    <UnClickable>
      <SubMenu title={<span>{label}</span>}>{menuItemsComponents}</SubMenu>
    </UnClickable>
  )
}

type DmtMenuItemProps = {
  id: string
  menuItem: MenuItem
  onClickContextMenu: Function
}

const IconWrapper = styled.span`
  margin-right: 8px;
`

const DmtMenuItem = (props: DmtMenuItemProps) => {
  const { id, onClickContextMenu, menuItem } = props
  return (
    <MenuItem
      data={{ action: menuItem.action }}
      onClick={e => {
        // click on menu item. Prevent onClick to propagate to components beneath
        e.stopPropagation()
        onClickContextMenu(id, menuItem.action)
      }}
      attributes={attributes}
    >
      {menuItem.icon && (
        <IconWrapper>
          <menuItem.icon />
        </IconWrapper>
      )}
      {menuItem.label}
    </MenuItem>
  )
}

export interface ContextMenuProps {
  id: string
  menuItems: MenuItem[]
  onClickContextMenu: Function
  children: any
}

export default (props: ContextMenuProps) => {
  const { id, menuItems, onClickContextMenu } = props

  const menuItemsComponents = renderMenuItems({
    id,
    onClickContextMenu,
    menuItems,
  })

  return (
    <span>
      <div>
        <ContextMenuTrigger id={id}>{props.children}</ContextMenuTrigger>
      </div>
      <ContextMenu data={{ test: 1 }} id={id}>
        {menuItemsComponents}
      </ContextMenu>
    </span>
  )
}
