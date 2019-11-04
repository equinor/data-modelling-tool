import {
  TextInput,
  AttributeWrapper,
  AttributeOnChange,
  DataType,
  TypeWrapper,
} from './AttributeInputs'
import React, { useState } from 'react'
import styled from 'styled-components'
import { BlueprintAttribute } from '../types'
import { isPrimitive } from '../pluginUtils'
import { DimensionWidget } from './DimensionWidget'
import { BooleanWidget } from './BooleanWidget'

const AttributeGroup = styled.div`
  border: 1px solid;
  margin: 2px;
  padding: 5px;
  border-radius: 5px;
`

type Props = {
  formData: any
  onChange: (value: any) => void
  attributes?: any[]
  uiSchema: any
}

export const AttributeWidget = (props: Props) => {
  let attributes = props.uiSchema.attributes
  if (!attributes) {
    console.error('this widget depends on a attributes list.')
  }

  const initialState = { type: DataType.STRING, ...props.formData }
  const [formData, setFormData] = useState<BlueprintAttribute>(initialState)
  //@todo add order in uiRecipe to change order of elements in the widget.
  const { type } = formData

  const onChange: AttributeOnChange = (
    attribute: BlueprintAttribute,
    value: string | boolean | number
  ): void => {
    const name = attribute.name
    let newFormData = { ...formData, [name]: value }
    setFormData(newFormData)
    props.onChange(newFormData)
  }

  const selectedType = formData['type']
  /**
   * Decision on the render code.
   * Trade off simplicity instead of complexity
   * Cons: nested if else in switch cases.
   * Pros: avoid lots of props passed to a component handling type string
   *
   * Consider refactor type string to a component handling different subcases.
   */
  return (
    <AttributeGroup>
      {attributes.map((blueprintAttribute: BlueprintAttribute) => {
        const { name } = blueprintAttribute
        const attributeType = blueprintAttribute.type

        let valueOrDefault =
          (formData as any)[name] || blueprintAttribute.default
        // can't use or operator on boolean.
        const value = (formData as any)[name]
        switch (attributeType) {
          case 'string':
            if (name === 'type') {
              return (
                <AttributeWrapper key={name}>
                  <TypeWrapper
                    onChange={onChange}
                    attribute={blueprintAttribute}
                  />
                </AttributeWrapper>
              )
            } else if (name === 'dimensions') {
              return (
                <AttributeWrapper key={name}>
                  <DimensionWidget
                    attribute={blueprintAttribute}
                    value={valueOrDefault}
                    onChange={onChange}
                  />
                </AttributeWrapper>
              )
            } else if (
              name === 'default' &&
              selectedType === DataType.BLUEPRINT
            ) {
              return null
            } else if (
              name === 'default' &&
              selectedType === DataType.BOOLEAN
            ) {
              return (
                <AttributeWrapper key={name}>
                  <BooleanWidget
                    attribute={blueprintAttribute}
                    value={value}
                    onChange={onChange}
                  />
                </AttributeWrapper>
              )
            } else {
              return (
                <AttributeWrapper key={name}>
                  <TextInput
                    attribute={blueprintAttribute}
                    value={value}
                    onChange={onChange}
                  />
                </AttributeWrapper>
              )
            }
          case 'boolean':
            return (
              <AttributeWrapper key={name}>
                <BooleanWidget
                  attribute={blueprintAttribute}
                  value={value}
                  onChange={onChange}
                />
              </AttributeWrapper>
            )

          default:
            if (isPrimitive(attributeType)) {
              console.warn(
                `Type is not supported in form widget: ${name} ${type}`
              )
            }
            return <div key={JSON.stringify(blueprintAttribute)} />
        }
      })}
    </AttributeGroup>
  )
}
