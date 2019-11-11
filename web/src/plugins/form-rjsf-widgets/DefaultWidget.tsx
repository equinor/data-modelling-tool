import React from 'react'
import { DmtWidgetProps } from './types'

export const DefaultWidget = (props: any) => {
  const { value, onChange, dtos, blueprint, label } = props
  console.log(props)
  return <div>DefaultWidget</div>
}
