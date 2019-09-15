import React from 'react'
import styled from 'styled-components'

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

const HeaderItem = styled.div`
  display: inline-flex;
  align-self: center;
`

export default (props: any) => {
  return (
    <HeaderWrapper>
      <HeaderItem>{props.children[0]}</HeaderItem>
      <HeaderItem>
        {props.children.length > 1 && props.children.slice(1)}
      </HeaderItem>
    </HeaderWrapper>
  )
}
