import * as React from 'react'
import { MakeDiagram } from './Diagram'

import { VerticalTabs, TabProp } from './VerticalTabs'

import { useDocument, DmtUIPlugin } from '@dmt/common'

const WorkflowTask_Component = (props: DmtUIPlugin) => {
  const { dataSourceId, documentId, updateDocument } = props

  const [document, isLoading, setDocument, hasError] = useDocument(
    dataSourceId,
    documentId,
    999
  )

  if (isLoading) {
    return <div>Loading document...</div>
  }

  if (hasError) {
    return <div>Error getting the document</div>
  }

  return <WorkflowTask document={document} />
}

const WorkflowTask = ({ document }: any) => {
  var tabs: any = []
  document.workflows.map((wf: any, index: number) =>
    tabs.push({ label: wf.name, content: <MakeDiagram document={wf} /> })
  )

  //6) render the diagram!
  return <VerticalTabs tabProps={tabs} />
}

export { WorkflowTask_Component as SIMA_WorkflowTask_View }
