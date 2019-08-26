import * as React from 'react'
import DroppableWrapper from './DroppableWrapper'

export interface INumberItemProps {
  id: string
  content: string
}

interface IVerticalColumnProps {
  droppableId: string
  items: INumberItemProps[]
  children: Function
  type: string
}

/*
This is a component to encapsulate the droppable column and the draggable items.
 */
export default (props: IVerticalColumnProps) => (
  <DroppableWrapper droppableId={props.droppableId} type={props.type}>
    {props.items.map((item, index) => props.children(item, index))}
  </DroppableWrapper>
)
