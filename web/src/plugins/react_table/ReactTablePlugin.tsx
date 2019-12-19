import React from 'react'
import { BlueprintAttribute, PluginProps } from '../types'
import { KeyValue } from '../BlueprintUtil'
import { ReactTable } from './ReactTable'
import { Blueprint } from '../Blueprint'

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

  const blueprint = new Blueprint(props.blueprint)
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
      const attr: BlueprintAttribute | undefined = blueprint.getAttribute(
        attrName
      )
      if (attr) {
        if (blueprint.isArray(attr) && blueprint.isPrimitive(attr.type)) {
          const values = document[attr.name]
          values.forEach((val: any, index: number) => {
            if (!rows[index]) {
              rows.push({
                subRows: [],
              })
            }
            rows[index][attr.name] = val
          })
        }

        //@todo use type and name in blueprint to check if document is array or not.
        // need blueprintProvider to avoid match on name.
        if (!blueprint.isArray(attr) && typeof document.slice !== undefined) {
          const values = document
          values.forEach((val: any, index: number) => {
            if (!rows[index]) {
              rows.push({
                subRows: [],
              })
            }
            rows[index][attr.name] = val[attr.name]
          })
        }
      }
    })
  } catch (err) {
    console.warn(err)
  }
  return rows
}
