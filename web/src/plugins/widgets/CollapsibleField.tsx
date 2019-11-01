import React from 'react'
import styled from 'styled-components'
// @ts-ignore
import useCollapse from 'react-collapsed'
import { FaChevronDown, FaChevronRight } from 'react-icons/all'
// @ts-ignore
import objectPath from 'object-path'

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

type Properties = {
  field?: string // custom field
  collapsed?: boolean // initial state
}

const getElement = (type: string, uiSchema: any, fields: any) => {
  const hasCustom = objectPath.has(uiSchema, 'collapse.field')
  if (hasCustom) {
    const fieldName = objectPath.get(uiSchema, 'collapse.field')
    return fields[fieldName]
  }
  return type == 'array' ? fields['ObjectField'] : fields['ArrayField']
}

export const CollapsibleField = (props: any) => {
  let {
    schema: { title, type },
    registry: { fields },
    name,
    uiSchema,
  } = props

  const { collapse } = uiSchema
  const { collapsed = true }: Properties = collapse
  const { getCollapseProps, getToggleProps, isOpen } = useCollapse(collapsed)

  const sectionTitle = uiSchema['ui:title']
    ? uiSchema['ui:title']
    : title
    ? title
    : name

  const CollapseElement = getElement(type, uiSchema, fields)

  return (
    <Wrapper>
      <Toggle {...getToggleProps()}>
        <Icons>
          {isOpen && <FaChevronDown />}
          {!isOpen && <FaChevronRight />}
        </Icons>
        {sectionTitle}
      </Toggle>
      <Content {...getCollapseProps()}>
        <CollapseElement {...props} />
      </Content>
    </Wrapper>
  )
}
