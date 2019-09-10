import * as React from 'react'
// @ts-ignore
import { Droppable, DroppableProvided } from 'react-beautiful-dnd'
import styled from 'styled-components'

const Container = styled.div`
  overflow: auto;
  margin-bottom: 50px;
`

interface ListProps {
  isDraggingOver: boolean
}

const List = styled.div<ListProps>`
  background-color: ${(props: ListProps) =>
    props.isDraggingOver ? 'skyblue' : 'white'};
`

export default (props: any) => {
  return (
    <Container>
      <Droppable
        droppableId={props.droppableId}
        isCombineEnabled={false}
        //type={props.type}
      >
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
