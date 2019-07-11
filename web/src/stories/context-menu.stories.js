import { storiesOf } from '@storybook/react'
import React from 'react'
import ContextMenu from '../components/context-menu/ContextMenu'

const menuItems = [
  {
    action: 'copy',
    onClick: () => console.log('click copy '),
    label: 'Copy',
  },
]

storiesOf('ContextMenu', module).add('test', () => (
  <ContextMenu id="test1" menuItems={menuItems}>
    <span style={{ padding: 5, border: '1px solid' }}>Right click me</span>
  </ContextMenu>
))
