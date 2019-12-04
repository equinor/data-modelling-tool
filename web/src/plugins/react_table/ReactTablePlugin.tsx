import React from 'react'
import { PluginProps } from '../types'
import { KeyValue } from '../BlueprintUtil'
import { ReactTable } from './ReactTable'

export const ReactTablePlugin = (props: PluginProps) => {
  const { document, uiRecipe } = props
  const mappings = {
    columns: uiRecipe.attributes
      .filter((attr: KeyValue) => attr.mapping === 'column')
      .map((attr: KeyValue) => attr.name),
  }

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

  function getData(mappings: KeyValue, document: KeyValue) {
    return document[mappings.columns[0]].map((value: any, index: number) => {
      const row: KeyValue = {
        subRows: [],
      }
      mappings.columns.forEach((attrName: string) => {
        row[attrName] = document[attrName][index]
      })
      return row
    })
  }

  const data = React.useMemo(() => getData(mappings, document), [])

  return <ReactTable columns={columns} data={data} />
}
