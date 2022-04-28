import * as React from 'react'

import { DmtPluginType, DmtUIPlugin, useDocument } from '@dmt/common'
import { JobLog } from './Job'

const PluginComponent = (props: DmtUIPlugin) => {
  const { documentId, dataSourceId } = props
  const [document, documentLoading, updateDocument, error] = useDocument(
    dataSourceId,
    documentId,
    false
  )
  if (documentLoading) return <div>Loading...</div>
  return <JobLog document={document} jobId={`${dataSourceId}/${documentId}`} />
}

export const plugins: any = [
  {
    pluginName: 'job',
    pluginType: DmtPluginType.UI,
    content: {
      component: PluginComponent,
    },
  },
]
