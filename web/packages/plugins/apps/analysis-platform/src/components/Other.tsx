import { OperationStatus } from '../Enums'
import styled, { keyframes } from 'styled-components'
import React from 'react'

interface StatusDotProps {
  status: OperationStatus | undefined
}

type IconWrapperProps = {
  color?: any
}

export const IconWrapper = styled.div<IconWrapperProps>`
  width: 22px;
  height: 22px;
  color: ${(props: IconWrapperProps) => props?.color};
  font-size: x-large;
  padding: 0 3px;
  display: flex;
  align-items: center;
`
const blinkAnimation = keyframes`
  0%, 100% {opacity: 0.2;}
  50% {opacity: 1;}
`
const AnimationWrapper = styled.div`
  animation: ${blinkAnimation} 2.5s infinite;
`

export const StatusDot = ({ status }: StatusDotProps): JSX.Element => {
  switch (status) {
    case OperationStatus.UPCOMING:
      return <IconWrapper color={'black'}>&#9679;</IconWrapper>
    case OperationStatus.ONGOING:
      return (
        <AnimationWrapper>
          <IconWrapper color={'orange'}>&#9679;</IconWrapper>
        </AnimationWrapper>
      )
    case OperationStatus.CONCLUDED:
      return <IconWrapper color={'green'}>&#9679;</IconWrapper>
    default:
      return <IconWrapper color={'grey'}>&#9679;</IconWrapper>
  }
}
