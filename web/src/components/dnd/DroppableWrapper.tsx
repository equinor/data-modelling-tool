import * as React from 'react'
import { Droppable, DroppableProvided } from 'react-beautiful-dnd'

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
})

/*
 https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/api/droppable.md
 */
export default (props: any) => (
  <Droppable
    droppableId={props.droppableId}
    isCombineEnabled={true}
    type={props.type}
  >
    {(provided: DroppableProvided, snapshot: any) => (
      <div
        style={getListStyle(snapshot.isDraggingOver)}
        className={props.className}
        ref={provided.innerRef}
        {...provided.droppableProps}
        {...provided.droppablePlaceholder}
      >
        {props.children}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
)
