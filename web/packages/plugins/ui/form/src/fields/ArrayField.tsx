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

export default function Fields(props: any) {
  const { namePath, label, name, type } = props

  const { control } = useFormContext()

  const { fields, append, remove, prepend } = useFieldArray({
    control,
    name: namePath,
  })

  return (
    <Wrapper>
      <Typography>
        {label === undefined || label === '' ? name : label}
      </Typography>
      <div>
        {fields.map((item: any, index: number) => {
          return (
            <div key={item.id}>
              <AttributeField
                namePath={`${namePath}.${index}`}
                formData={item}
                attribute={{
                  attributeType: type,
                  dimensions: '',
                }}
              />
              <Button type="button" onClick={() => remove(index)}>
                Remove
              </Button>
            </div>
          )
        })}
      </div>
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
