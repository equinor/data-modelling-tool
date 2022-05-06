import * as React from 'react'
import { MakeDiagram } from './Diagram'

//import {useEffect, useState} from 'react'
import { useDocument, DmtUIPlugin } from '@dmt/common'

const Workflow_Component = (props: DmtUIPlugin) => {
  const { dataSourceId, documentId, updateDocument } = props

  const [document, isLoading, setDocument, hasError] = useDocument(
    dataSourceId,
    documentId,
    true
  )

  if (isLoading) {
    return <div>Loading document...</div>
  }

  if (hasError) {
    return <div>Error getting the document</div>
  }

  return <Workflow document={document} />
}

const Workflow = ({ document }: any) => {
  console.log(document)

  //6) render the diagram!
  return <MakeDiagram document={document} />
}

export { Workflow_Component as SIMA_Workflow_View }
