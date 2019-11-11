import React from 'react'
import { DocumentData } from '../types'
// import {
//   findDto,
//   getAttributeStringValue,
//   getBlueprintNameFromType,
// } from '../pluginUtils'
import { DmtWidgetProps } from './types'

/**
 * The dropdown has the same behavior as rjsf native widgets.
 * Output = formData + onChange
 *
 * It shows the first value as selected or the default value.
 *
 * @param props
 * @constructor
 */
export const EnumWidget = (props: DmtWidgetProps) => {
  const { value, onChange, dtos, blueprint, label } = props
  //use label which is the name of the attribute.
  // const enumTypeValue: string | null = getAttributeStringValue(
  //   blueprint,
  //   label,
  //   'enumType'
  // )
  let options: Option[] = []
  let selectedValue = value
  // if (enumTypeValue) {
  //   const blueprintName = getBlueprintNameFromType(enumTypeValue)
  //   const enumEntity: DocumentData | null = findDto(dtos, blueprintName)
  //   if (enumEntity && enumEntity.defaultValue) {
  //     selectedValue = enumEntity.defaultValue
  //   }
  //   options = getOptionsFromEnumEntity(enumEntity, enumTypeValue)
  // }
  if (options.length === 0) {
    return null
  }
  return (
    <Select
      options={options}
      value={selectedValue}
      onChange={value => {
        onChange(value)
      }}
    />
  )
}

type Option = {
  value: string
  label: string
}

type SelectProps = {
  options: Option[]
  value: string
  onChange: (event: any) => void
}

const Select = (props: SelectProps) => {
  const { options, value, onChange } = props
  let selectOptions: Option[] = options

  return (
    <select
      onChange={(event: any) => onChange(event.target.value)}
      value={value}
    >
      {selectOptions.map(option => {
        return (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        )
      })}
    </select>
  )
}

function getOptionsFromEnumEntity(
  enumEntity: any,
  enumTypeValue: string
): Option[] {
  const options: Option[] = []
  if (enumEntity && enumEntity.values && enumEntity.labels) {
    enumEntity.values.forEach((value: any, index: number) => {
      const label = enumEntity.labels[index]
      if (label) {
        options.push({
          value,
          label,
        })
      } else {
        console.warn(
          `enum is invalid. Values and labels does not match. ${enumTypeValue}`
        )
      }
    })
  }
  return options
}
