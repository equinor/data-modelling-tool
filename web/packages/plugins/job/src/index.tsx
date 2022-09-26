import * as React from 'react'

import {
  EDmtPluginType,
  IDmtUIPlugin,
  useDocument,
  TJob,
  Loading,
} from '@development-framework/dm-core'
import { JobControl } from './JobControl'
import { JobInputEdit } from './JobInputEdit'

const JobControlWrapper = (props: IDmtUIPlugin) => {
  const { documentId, dataSourceId } = props
  const [document, documentLoading, updateDocument, error] = useDocument<TJob>(
    dataSourceId,
    documentId
  )
  if (documentLoading) return <Loading />
  if (error) {
    const errorResponse =
      typeof error.response?.data == 'object'
        ? error.response?.data?.message
        : error.response?.data
    return <div>Something went wrong; {errorResponse}</div>
  }
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
    pluginType: EDmtPluginType.UI,
    component: JobControlWrapper,
  },
  {
    pluginName: 'jobInputEdit',
    pluginType: EDmtPluginType.UI,
    component: JobInputEdit,
  },
]
