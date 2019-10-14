import { NodeType } from '../../api/types'

export enum NodeIconType {
  'file' = 'file',
  'folder' = 'folder',
  'database' = 'database',
  'ref' = 'ref',
  'default' = '',
}

export type TreeNodeData = {
  nodeId: string
  nodeType: NodeType
  isOpen: boolean
  title: string
  isExpandable: boolean
  isRoot: boolean
  icon?: NodeIconType
  isHidden?: boolean
  isFolder: boolean
  templateRef?: string
  children?: string[]
  meta?: object
}
