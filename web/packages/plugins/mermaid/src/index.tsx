import * as React from 'react'
import { useContext, useEffect, useState } from 'react'

import {
  AuthContext,
  DmssAPI,
  EDmtPluginType,
  IDmtUIPlugin,
  Loading,
  useDocument,
} from '@development-framework/dm-core'
import Mermaid from './Mermaid'
import { dfs, loader, Node } from './loader'
import { TAttributeType } from './types'

const classElement = (node: Node) => {
  const primitiveAttributeElements = node
    .primitiveAttributes()
    .map(
      (attribute: TAttributeType) =>
        `${attribute.attributeType} ${attribute.name}`
    )
  return `
        class ${node.entity['name']} {
            ${node.entity['abstract'] ? '<<abstract>>' : ''}
            ${primitiveAttributeElements.join('\n')} 
        }`
}

const edgeElement = (node: Node) => {
  if (node.concrete) {
    return `${node.parent.entity['name']} <|-- ${node.entity['name']} \n`
  } else {
    const dimensions = node.attribute['dimensions'] || '1'
    const contained = node.attribute['contained'] ? '(not contained)' : ''
    return `${node.parent.entity['name']} --> "${dimensions}" ${node.entity['name']} : ${node.attribute['name']} ${contained} \n`
  }
}

const createChart = (tree: Node): string => {
  const classElements: any = {}
  let edgeElements = ``

  for (const node of dfs(tree)) {
    // We only want to add a class element once
    const alreadyAdded = node.entity['name'] in classElements
    if (!alreadyAdded) {
      classElements[node.entity['name']] = classElement(node)
    }
    if (node.parent) {
      edgeElements += edgeElement(node)
    }
  }

  let chart = ` 
      classDiagram                                   
      ${edgeElements} 
    `

  // Add class elements to chart.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [key, value] of Object.entries(classElements)) {
    chart += value
  }

  return chart
}

function useExplorer(dmssAPI: DmssAPI) {
  const blueprintGet = (typeRef: string) =>
    dmssAPI.blueprintGet({ typeRef: typeRef })
  return {
    blueprintGet,
  }
}

const PluginComponent = (props: IDmtUIPlugin) => {
  const { documentId, dataSourceId } = props
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)
  const explorer = useExplorer(dmssAPI)

  const [chart, setChart] = useState<string | undefined>(undefined)

  const [document, loading] = useDocument(dataSourceId, documentId)

  useEffect(() => {
    loader(token, explorer, document).then(async (tree: Node) => {
      const chart = createChart(tree)
      setChart(chart)
    })
  }, [])

  if (!chart) return <div>Creating chart...</div>
  if (loading) {
    return <Loading />
  }
  return (
    <div>
      <Mermaid chart={chart} />
    </div>
  )
}

export const plugins: any = [
  {
    pluginName: 'mermaid',
    pluginType: EDmtPluginType.UI,
    component: PluginComponent,
  },
]
