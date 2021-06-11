import * as React from 'react'

import { DmtPluginType, DmtUIPlugin } from '@dmt/core-plugins'
import { useEffect, useState } from 'react'
import UpdateBlueprintDescription from './DisplayBlueprintData'
import EditDocumentDescription from './EditDocumentDescription'

const storeDocumentData = (
  documentId: string,
  dataSourceId: string,
  explorer: any,
  setDocument: (document: any) => void,
  document: any
) => {
  if (!document && dataSourceId && documentId) {
    const target = documentId.split('.')
    explorer
      .get({
        dataSourceId,
        documentId: target.shift(),
        attribute: target.join('.'),
      })
      .then((result: any) => {
        setDocument(result.document)
      })
  }
}

const DisplayBlueprintData = (props: DmtUIPlugin) => {
  const {
    documentId,
    dataSourceId,
    explorer,
    type,
    updateDocument,
    uiRecipeName,
    useIndex,
  } = props

  const [document, setDocument] = useState(undefined)

  useEffect(() => {
    storeDocumentData(documentId, dataSourceId, explorer, setDocument, document)
  }, [dataSourceId, documentId])

  if (!document) return <div>Loading...</div>

  return <UpdateBlueprintDescription document={document} />
}

const UpdateBlueprint = (props: DmtUIPlugin) => {
  const {
    documentId,
    dataSourceId,
    explorer,
    type,
    updateDocument,
    uiRecipeName,
    useIndex,
  } = props

  const [document, setDocument] = useState(undefined)

  useEffect(() => {
    storeDocumentData(documentId, dataSourceId, explorer, setDocument, document)
  }, [dataSourceId, documentId])

  if (!document) return <div>Loading...</div>

  return (
    <EditDocumentDescription
      document={document}
      updateDocument={updateDocument}
    />
  )
}

export const plugins: any = [
  {
    pluginName: 'update-blueprint',
    pluginType: DmtPluginType.UI,
    content: {
      component: UpdateBlueprint,
    },
  },
  {
    pluginName: 'display-blueprint-data',
    pluginType: DmtPluginType.UI,
    content: {
      component: DisplayBlueprintData,
    },
  },
]
