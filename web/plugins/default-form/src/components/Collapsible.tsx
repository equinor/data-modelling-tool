import * as React from 'react'
import styled from 'styled-components'
// @ts-ignore
import useCollapse from 'react-collapsed'
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'

const Wrapper = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 2px;
`

const Toggle = styled.div`
  background-color: #f4f4f4;
  color: #444;
  cursor: pointer;
  padding: 18px;
  width: 100%;
  text-align: left;
  border: none;
`

const Content = styled.div`
  padding: 20px;
  animation: fadein 0.35s ease-in;
`

const Icons = styled.span`
  margin-right: 5px;
`

type Props = {
  collapsed?: boolean // initial state
  disabled?: boolean
  children: any
  sectionTitle: string
}

interface CollapsibleWrapperProps extends Props {
  useCollapsible: boolean
}

export const CollapsibleWrapper = (props: CollapsibleWrapperProps) => {
  if (props.useCollapsible) {
    return <Collapsible {...props}>{props.children}</Collapsible>
  }
  return <div>{props.children}</div>
}

export const Collapsible = (props: Props) => {
  const { getCollapseProps, getToggleProps, isOpen } = useCollapse(
    props.collapsed,
  )

  return (
    <Wrapper>
      <Toggle {...getToggleProps()}>
        <Icons>
          {isOpen && <FaChevronDown />}
          {!isOpen && <FaChevronRight />}
        </Icons>
        {props.sectionTitle}
      </Toggle>
      <Content {...getCollapseProps()}>{props.children}</Content>
    </Wrapper>
  )
}
