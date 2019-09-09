import * as React from 'react'
// @ts-ignore
import { Droppable, DroppableProvided } from 'react-beautiful-dnd'
import styled from 'styled-components'
import { useState } from 'react'

const Container = styled.div`
  height: 300px;
  overflow: auto;
`

interface ListProps {
  isDraggingOver: boolean
}

const List = styled.div<ListProps>`
  background-color: ${(props: ListProps) =>
    props.isDraggingOver ? 'white' : 'white'};
`

export default (props: any) => {
  return (
    <Container onMouseMove={props.onMouseMove}>
      <Droppable droppableId={props.droppableId} isCombineEnabled={true}>
        {(provided: DroppableProvided, snapshot: any) => {
          return (
            <List
              ref={provided.innerRef}
              {...provided.droppableProps}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {props.children}
              {provided.placeholder}
            </List>
          )
        }}
      </Droppable>
    </Container>
  )
}
