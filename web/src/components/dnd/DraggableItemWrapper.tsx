import * as React from 'react'
// @ts-ignore
import { Draggable } from 'react-beautiful-dnd'

/*
https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/api/draggable.md
*/

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'gray',

  // styles we need to apply on draggables
  ...draggableStyle,
})

export default (props: any) => (
  <Draggable draggableId={props.draggableId} index={props.index}>
    {(provided: any, snapshot: any) => (
      <div>
        <div
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {props.children}
        </div>
        {provided.placeholder}
      </div>
    )}
  </Draggable>
)
