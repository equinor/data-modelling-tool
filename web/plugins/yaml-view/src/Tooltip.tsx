import styled, { keyframes } from 'styled-components'
import { Button } from '@dmt/common'
import React, { useState } from 'react'

const tempVisible = keyframes`
  0%, 100% {opacity: 0;}
  10%, 90% {opacity: 1;}
`
const TooltipText = styled.div`
  font-size: 0.7rem;
  width: 60px;
  height: 20px;
  background-color: #c1cae0;
  color: #000000;
  text-align: center;
  padding: 2px 0;
  margin-bottom: 6px;
  border-radius: 3px;
  border: black solid 1px;
  z-index: 1;
  animation: ${tempVisible} 2s;
`
export default ({ text, tooltipText }: any) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false)

  return (
    <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'center' }}>
      {
        showTooltip ? (
          <TooltipText onAnimationEnd={() => setShowTooltip(false)}>
            {tooltipText}
          </TooltipText>
        ) : (
          <div style={{ height: '26px' }} />
        ) // This a spacer for the tooltip when it's hidden
      }
      <Button onClick={() => setShowTooltip(true)}>{text}</Button>
    </div>
  )
}
