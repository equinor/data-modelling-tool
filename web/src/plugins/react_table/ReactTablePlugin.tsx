import React from 'react'
import { KeyValue, PluginProps } from '../../domain/types'
import { ReactTable } from './ReactTable'
import { Blueprint } from '../../domain/Blueprint'
import { BlueprintAttribute } from '../../domain/BlueprintAttribute'

type RowData = {
  subRows: any[]
  [key: string]: any
}

export const ReactTablePlugin = (props: PluginProps) => {
  const { document, uiRecipe } = props
  const mappings = {
    columns: uiRecipe.attributes
      .filter((attr: KeyValue) => attr.mapping === 'column')
      .map((attr: KeyValue) => attr.name),
  }

  const blueprint = new Blueprint(props.blueprintType)
  const columns = React.useMemo(
    () => [
      {
        Header: 'Table',
        columns: mappings.columns.map(attrName => ({
          Header: attrName,
          accessor: attrName,
        })),
      },
    ],
    []
  )

  const data = React.useMemo(() => getData(mappings, document, blueprint), [])

  return <ReactTable columns={columns} data={data} />
}

export function getData(
  mappings: KeyValue,
  document: KeyValue,
  blueprint: Blueprint
): RowData[] {
  const rows: RowData[] = []
  try {
    mappings.columns.forEach((attrName: string) => {
      const attr:
        | BlueprintAttribute
        | undefined = blueprint.getBlueprintAttribute(attrName)
      if (attr) {
        if (attr.isArray() && attr.isPrimitive()) {
          const values = document[attr.getName()]
          values.forEach((val: any, index: number) => {
            if (!rows[index]) {
              rows.push({
                subRows: [],
              })
            }
            rows[index][attr.getName()] = val
          })
        }

        // need blueprintProvider to avoid match on name.
        if (!attr.isArray() && typeof document.slice !== undefined) {
          const values = document
          values.forEach((val: any, index: number) => {
            if (!rows[index]) {
              rows.push({
                subRows: [],
              })
            }
            rows[index][attr.getName()] = val[attr.getName()]
          })
        }
      }
    })
  } catch (err) {
    console.warn(err)
  }
  return rows
}
