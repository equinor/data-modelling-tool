import * as React from 'react'
import { MakeDiagram } from './Diagram'

//import {useEffect, useState} from 'react'
import {
  useDocument,
  IDmtUIPlugin,
  Loading,
} from '@development-framework/dm-core'

const Workflow_Component = (props: IDmtUIPlugin) => {
  const { dataSourceId, documentId } = props

  const [document, loading, updateDocument, hasError] = useDocument(
    dataSourceId,
    documentId,
    999
  )

  if (loading) {
    return <Loading />
  }

  if (hasError) {
    return <div>Error getting the document</div>
  }

  return <Workflow document={document} />
}

const Workflow = ({ document }: any) => {
  //6) render the diagram!
  return <MakeDiagram document={document} />
}

export { Workflow_Component as SIMA_Workflow_View }
