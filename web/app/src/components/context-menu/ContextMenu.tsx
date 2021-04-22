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
  data?: any
}

type DmtMenuItemsProps = {
  id: string
  onClick: Function
  menuItems: MenuItem[]
}

const renderMenuItems = (props: DmtMenuItemsProps) => {
  const { id, menuItems, onClick } = props
  return menuItems.map((menuItem: MenuItem, index: number) => {
    const key = `menuitem-${id}-${index}`
    if (Object.keys(menuItem).length === 0) {
      return <MenuItem divider />
    } else if (menuItem.menuItems) {
      return (
        <DmtSubMenu
          id={id}
          key={key}
          onClick={onClick}
          menuItems={menuItem.menuItems}
          label={menuItem.label}
        />
      )
    } else {
      return (
        <DmtMenuItem
          key={key}
          id={id}
          onClick={onClick}
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
  onClick: Function
}

const UnClickable = ({ children }: any) => (
  <span onClick={(e: any) => e.stopPropagation()}>{children}</span>
)

const DmtSubMenu = (props: DmtSubMenuProps) => {
  const { id, label, onClick, menuItems } = props

  const menuItemsComponents = renderMenuItems({
    id,
    onClick,
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
  onClick: Function
}

const IconWrapper = styled.span`
  margin-right: 8px;
`

const DmtMenuItem = (props: DmtMenuItemProps) => {
  const { id, onClick, menuItem } = props
  return (
    <MenuItem
      data={{ action: menuItem.action }}
      onClick={e => {
        // click on menu item. Prevent onClick to propagate to components beneath
        e.stopPropagation()
        onClick(id, menuItem.action, menuItem.data, menuItem.label)
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
  onClick: Function
  children?: any
}

export default (props: ContextMenuProps) => {
  const { id, menuItems, onClick } = props

  const menuItemsComponents = renderMenuItems({
    id,
    onClick,
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
