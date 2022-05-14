import React from 'react'
// @ts-ignore
import { useFieldArray, useFormContext } from 'react-hook-form'
import { AttributeField } from './AttributeField'
import { Button, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { isPrimitive } from '../utils'

const Wrapper = styled.div`
  margin-top: 20px;
`

const ItemsWrapper = styled.div`
  margin-bottom: 20px;
`

const ItemWrapper = styled.div`
  display: flex;
  padding: 4px;
`

const isPrimitiveType = (value: string): boolean => {
  // dont make this a static method. Needs to read attribute types later?
  return ['string', 'number', 'integer', 'number', 'boolean'].includes(value)
}

export default function Fields(props: any) {
  const { namePath, displayLabel, type } = props

  const { control } = useFormContext()

  const { fields, append, remove, prepend } = useFieldArray({
    control,
    name: namePath,
  })

  if (!isPrimitiveType(type)) return <></>

  return (
    <Wrapper>
      <Typography bold={true}>{displayLabel}</Typography>
      <ItemsWrapper>
        {fields.map((item: any, index: number) => {
          return (
            <ItemWrapper key={item.id}>
              <AttributeField
                namePath={`${namePath}.${index}`}
                attribute={{
                  attributeType: type,
                  dimensions: '',
                }}
              />
              <Button type="button" onClick={() => remove(index)}>
                Remove
              </Button>
            </ItemWrapper>
          )
        })}
      </ItemsWrapper>
      <Button
        data-testid={`add-${namePath}`}
        onClick={() => {
          // TODO: Fill with default values using createEntity?
          const defaultValue = isPrimitive(type) ? ' ' : {}
          append(defaultValue)
        }}
      >
        Add
      </Button>
    </Wrapper>
  )
}
