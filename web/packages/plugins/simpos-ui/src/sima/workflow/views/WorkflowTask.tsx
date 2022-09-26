import * as React from 'react'
import { MakeDiagram } from './Diagram'

import { VerticalTabs, ITabProp } from './VerticalTabs'

import {
  useDocument,
  IDmtUIPlugin,
  Loading,
} from '@development-framework/dm-core'

const WorkflowTask_Component = (props: IDmtUIPlugin) => {
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

  return <WorkflowTask document={document} />
}

const WorkflowTask = ({ document }: any) => {
  const tabs: any = []
  document.workflows.map((wf: any, index: number) =>
    tabs.push({ label: wf.name, content: <MakeDiagram document={wf} /> })
  )

  //6) render the diagram!
  return <VerticalTabs tabProps={tabs} />
}

export { WorkflowTask_Component as SIMA_WorkflowTask_View }
