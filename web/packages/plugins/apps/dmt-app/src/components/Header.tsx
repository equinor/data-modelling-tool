import React from 'react'
import styled from 'styled-components'

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
`

const HeaderItem = styled.div`
  align-self: center;
  display: inline-flex;
`

export default (props: any) => {
  const { children } = props
  const items = [children].map((child: any, index: number) => {
    return <HeaderItem key={`${index}`}>{child}</HeaderItem>
  })
  return <HeaderWrapper>{items}</HeaderWrapper>
}
