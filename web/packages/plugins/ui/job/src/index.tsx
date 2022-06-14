import * as React from 'react'

import {
  DmtPluginType,
  DmtUIPlugin,
  useDocument,
  TJob,
  Loading,
} from '@dmt/common'
import { JobControl } from './JobControl'
import { JobInputEdit } from './JobInputEdit'

const JobControlWrapper = (props: DmtUIPlugin) => {
  const { documentId, dataSourceId } = props
  const [document, documentLoading, updateDocument, error] = useDocument<TJob>(
    dataSourceId,
    documentId
  )
  if (documentLoading) return <Loading />
  if (error)
    return <div>Something went wrong; {error.response?.data?.message}</div>
  if (!document) return <div>The job document is empty</div>
  return (
    <JobControl
      document={document}
      jobId={`${dataSourceId}/${documentId}`}
      updateDocument={updateDocument}
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
    pluginName: 'jobInputEdit',
    pluginType: DmtPluginType.UI,
    component: JobInputEdit,
  },
]
