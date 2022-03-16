import { useBlueprint } from '@dmt/common'
import React, { useState } from 'react'
import { AttributeField } from './AttributeField'
import { Button, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { ObjectFieldProps } from '../types'
import { useFormContext } from 'react-hook-form'

const Wrapper = styled.div`
  margin-top: 20px;
`

const AttributeListWrapper = styled.div`
  margin-top: 30px;
`

const AddObject = (props: any) => {
  const { type, namePath, onAdd } = props
  const { setValue } = useFormContext()

  const handleAdd = () => {
    // TODO: Fill with default values using createEntity?
    const values = {
      type: type,
    }
    const options = {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    }
    setValue(namePath, values, options)
    onAdd()
  }
  return (
    <Button data-testid={`add-${namePath}`} onClick={handleAdd}>
      Add
    </Button>
  )
}

const withOptional = (WrappedComponent: any) => (props: any) => {
  const { type, namePath } = props

  const { getValues } = useFormContext()
  const initialValue = getValues(namePath) !== undefined
  const [isDefined, setIsDefined] = useState(initialValue)

  if (!isDefined) {
    return (
      <AddObject
        namePath={namePath}
        type={type}
        onAdd={() => setIsDefined(true)}
      />
    )
  } else {
    return <WrappedComponent {...props} />
  }
}

const AttributeList = (props: any) => {
  const { type, namePath } = props

  const [blueprint, isLoading, error] = useBlueprint(type)
  if (isLoading) return <div>Loading...</div>
  if (blueprint === undefined) return <div>Could not find blueprint</div>

  const prefix = namePath === '' ? `` : `${namePath}.`
  const attributeFields = blueprint.attributes.map((attribute: any) => {
    return (
      <AttributeField
        key={`${prefix}${attribute.name}`}
        namePath={`${prefix}${attribute.name}`}
        attribute={attribute}
      />
    )
  })

  return <AttributeListWrapper>{attributeFields}</AttributeListWrapper>
}

export const ObjectField = (props: ObjectFieldProps) => {
  const { type, namePath, displayLabel = '', optional = false } = props

  // TODO: How to handle object type?
  if (type === 'object') return <></>

  const Content = optional ? withOptional(AttributeList) : AttributeList

  return (
    <Wrapper>
      <Typography>{displayLabel}</Typography>
      <Content type={type} namePath={namePath} />
    </Wrapper>
  )
}
