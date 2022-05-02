import * as React from 'react'
import { MakeDiagram } from './Diagram'

import { VerticalTabs, TabProp } from './VerticalTabs'

//import {useEffect, useState} from 'react'
import { useDocument } from '@dmt/common'
import { DmtUIPlugin } from '@dmt/core-plugins'

const WorkflowTask_Component = (props: DmtUIPlugin) => {
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

  return <WorkflowTask document={document} />
}

const WorkflowTask = ({ document }) => {
  console.log(document)

  var tabs = []
  document.workflows.map((wf, index) =>
    tabs.push({ label: wf.name, content: <MakeDiagram document={wf} /> })
  )

  //6) render the diagram!
  return <VerticalTabs tabProps={tabs} />
}

export { WorkflowTask_Component as SIMA_WorkflowTask_View }
