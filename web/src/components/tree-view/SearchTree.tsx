import React from 'react'
//@ts-ignore
import styled from 'styled-components'
import { WORKING_COLOR } from './../styles'

type SearchTreeProps = {
  value: string
  onChange: (value: string) => {}
}

const Input = styled.input`
  font-family: Equinor-Medium;
  width: 100%;
  padding: 0.5rem 0.75rem;
  line-height: 1.25;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.45rem;
`

export default (props: SearchTreeProps) => {
  const { onChange } = props
  return (
    <Input
      placeholder="Search for blueprint"
      onKeyUp={(e: any) => {
        onChange(e.target.value.trim())
      }}
    />
  )
}
