import React from 'react'
import { BlueprintType, BlueprintAttribute } from '../../types'
import { Pre } from '../../preview/PreviewPlugin'
import { Dimension } from '../../Dimension'

type Props = {
  blueprintType: BlueprintType
  parentAttribute: BlueprintAttribute
  attribute: BlueprintAttribute
}

/**
 * A widget available on the attribute level. Use another plugin if the entire document should be presented as a table.
 * Supports arrays only. Properties with dimension *
 *
 * @param blueprint
 * @param attribute
 */
export default ({ blueprintType, parentAttribute, attribute }: Props) => {
  let values: any[] = []
  if (new Dimension(parentAttribute).isArray()) {
    values = (blueprintType as any)[parentAttribute.name]
  }
  if (values.length === 0) {
    // show the property name and value
    return (
      <div style={{ padding: '5px 0' }}>
        <span style={{ marginRight: 20 }}>{parentAttribute.name}:</span>
        <span>{JSON.stringify(values)}</span>
      </div>
    )
  }
  return (
    <div style={{ padding: '20px 0' }}>
      <div>{attribute.name}</div>
      <table>
        <thead>
          <tr>
            {values.map((attr: BlueprintAttribute) => {
              return <th key={attr.name}>{attr.name}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {values.map((attr: BlueprintAttribute, index: number) => {
            const rowKey = `${index}-${attr.name}`
            return <Row key={rowKey} attribute={attr} />
          })}
        </tbody>
      </table>
    </div>
  )
}

type RowProps = {
  attribute: BlueprintAttribute
}

const Row = ({ attribute }: RowProps) => {
  return (
    <tr style={{ border: '1px solid' }}>
      {Object.keys(attribute).map((key: string) => {
        let value = (attribute as any)[key]

        if (key === 'attributes') {
          value = JSON.stringify(value, null, 2)
          return (
            <td key={key}>
              <Pre style={{ maxHeight: 200, width: 400 }}>{value}</Pre>
            </td>
          )
        } else {
          return (
            <td style={{ padding: 5, verticalAlign: 'top' }} key={key + 'cell'}>
              {value}
            </td>
          )
        }
      })}
    </tr>
  )
}
