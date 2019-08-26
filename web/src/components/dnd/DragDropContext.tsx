import * as React from 'react'
// @ts-ignore
import { DragDropContext } from 'react-beautiful-dnd'

interface IVerticalColumnContextProps {
  onDragEnd: (result: any) => void
  children: any
}

export default (props: IVerticalColumnContextProps) => (
  <div>
    <DragDropContext onDragEnd={props.onDragEnd} {...props} />
  </div>
)
