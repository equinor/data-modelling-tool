import * as React from 'react'
// @ts-ignore
import { Draggable } from 'react-beautiful-dnd'
import styled from 'styled-components'

interface ContainerProps {
  isDragging: boolean
}

const Container = styled.div<ContainerProps>`
  background-color: ${(props: ContainerProps) =>
    props.isDragging ? 'lightgreen' : 'white'};
`

export default (props: any) => {
  return (
    <Draggable
      draggableId={props.draggableId}
      index={props.index}
      isDragDisabled={!props.isDragEnabled}
    >
      {(provided: any, snapshot: any) => {
        return (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
          >
            {props.children}
            {provided.placeholder}
          </Container>
        )
      }}
    </Draggable>
  )
}
