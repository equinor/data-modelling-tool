import * as React from 'react'

import { DmtPluginType, DmtUIPlugin, useDocument, TJob } from '@dmt/common'
import { JobControl } from './JobControl'
import { JobEdit } from './JobEdit'

const JobControlWrapper = (props: DmtUIPlugin) => {
  const { documentId, dataSourceId } = props
  const [document, documentLoading, updateDocument, error] = useDocument<TJob>(
    dataSourceId,
    documentId,
    false
  )
  if (documentLoading) return <div>Loading...</div>
  if (error) return <div>Something went wrong; {error}</div>
  if (!document) return <div>The job document is empty</div>
  return (
    <JobControl
      document={document}
      jobId={`${dataSourceId}/${documentId}`}
      updateDocument={updateDocument}
    />
  )
}

const JobEditWrapper = (props: DmtUIPlugin) => {
  const { documentId, dataSourceId, onOpen } = props
  const [
    document,
    documentLoading,
    updateDocument,
    error,
    fetchDocument,
  ] = useDocument<TJob>(dataSourceId, documentId, false)
  if (documentLoading) return <div>Loading...</div>
  if (error) return <div>Something went wrong; {error}</div>
  if (!document) return <div>The job document is empty</div>
  return (
    <JobEdit
      document={document}
      dataSourceId={dataSourceId}
      documentId={documentId}
      updateDocument={updateDocument}
      onSubmit={fetchDocument}
    />
  )
}

export const plugins: any = [
  {
    pluginName: 'jobControl',
    pluginType: DmtPluginType.UI,
    component: JobControlWrapper,
  },
  {
    pluginName: 'jobEdit',
    pluginType: DmtPluginType.UI,
    component: JobEditWrapper,
  },
]
