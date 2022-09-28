import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import Icon from '../Design/Icons'
import './Menu.css'
import { useLocalStorage } from '@development-framework/dm-core'

const { Sider } = Layout

export default (props: { appRootPath: string }): JSX.Element => {
  const { appRootPath } = props
  const location = useLocation()
  const [collapsed, setCollapsed] = useLocalStorage('menuCollapsed', false)
  const iconSize: 24 | 16 | 32 | 40 | 48 | undefined = 24
  const menuUrl: string[] = [`/${appRootPath}`, `/${appRootPath}/analyses`]
  return (
    <Sider
      style={{ borderRight: '#E6E6E6 1px solid', minHeight: '100vh' }}
      theme="light"
      width="250"
      collapsible
      //@ts-ignore
      collapsed={collapsed}
      //@ts-ignore
      onCollapse={(collapsed: boolean) => setCollapsed(collapsed)}
    >
      <Menu
        theme="light"
        defaultSelectedKeys={[location.pathname]}
        mode="inline"
      >
        <Menu.Item key={menuUrl[0]} icon={<Icon name="home" size={iconSize} />}>
          <Link to={{ pathname: menuUrl[0] }}>Assets</Link>
        </Menu.Item>
        <Menu.Item key={menuUrl[1]} icon={<Icon name="list" size={iconSize} />}>
          <Link to={{ pathname: menuUrl[1] }}>Analyses</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  )
}
