import React from 'react'
import { FaPlay } from 'react-icons/fa'
import styled from 'styled-components'
import { TreeNodeRenderProps } from '@dmt/common'
import { FaSpinner } from 'react-icons/fa'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`

const RunIconWrapper = styled.div`
  color: limegreen;
  margin-left: 10px;
  font-size: 10px;
  align-self: center;
`

// You can increase or decrease the timer (5s)
// to increase or decrease the speed of the spinner
const Spinner = styled(FaSpinner)`
  animation: spin infinite 1s linear;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

const RunIcon = () => {
  return (
    <RunIconWrapper>
      <FaPlay style={{ display: 'block' }} />
    </RunIconWrapper>
  )
}

export const DocumentNode = (props: any) => {
  const { onToggle, onOpen } = props
  const node: TreeNodeRenderProps = { ...props.node }
  const meta = { ...node.nodeData.meta }

  return (
    <Wrapper>
      {node.iconGroup(() => onToggle())}
      <div style={{ width: '100%' }} onClick={() => onOpen()}>
        {node.nodeData.title}
        {meta.hasCustomAction && <RunIcon />}
        {node.nodeData.isLoading && (
          <small style={{ paddingLeft: '15px' }}>
            <Spinner size="1.2em" />
          </small>
        )}
        {node.nodeData.meta.error && (
          <small style={{ paddingLeft: '15px' }}>An error occurred...</small>
        )}
      </div>
    </Wrapper>
  )
}
