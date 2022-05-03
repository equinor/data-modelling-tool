import * as React from 'react'
import { MakeDiagram } from './Diagram'

//import {useEffect, useState} from 'react'
import { useDocument } from '@dmt/common'
import { DmtUIPlugin } from '@dmt/core-plugins'

const Workflow_Component = (props: DmtUIPlugin) => {
  const { dataSourceId, documentId, attribute, updateDocument } = props

  const [document, isLoading, setDocument, hasError] = useDocument(
    dataSourceId,
    documentId,
    attribute
  )

  if (isLoading) {
    return <div>Loading document...</div>
  }

  if (hasError) {
    return <div>Error getting the document</div>
  }

  return <Workflow document={document} />
}

const Workflow = ({ document }) => {
  console.log(document)

  //6) render the diagram!
  return <MakeDiagram document={document} />
}

export { Workflow_Component as SIMA_Workflow_View }
