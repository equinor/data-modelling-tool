import { WidgetProps } from 'react-jsonschema-form'
import { Blueprint, Dto } from '../types'

export interface DmtWidgetProps extends WidgetProps {
  blueprint: Blueprint
  dtos: Dto[]
  [key: string]: any
}
