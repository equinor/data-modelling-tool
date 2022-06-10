import { DmtUIPlugin, UIPluginSelector } from '@dmt/common'
import * as React from 'react'

export const EditInput = (props: DmtUIPlugin) => {
  const { document, documentId, dataSourceId, onOpen } = props
  if (!document?.applicationInput) {
    return <pre style={{ color: 'red' }}>No input exists for the analysis</pre>
  }
  return (
    <div>
      <UIPluginSelector
        absoluteDottedId={`${dataSourceId}/${documentId}.applicationInput`}
        entity={document?.applicationInput}
        categories={['edit']}
        referencedBy={`${dataSourceId}/${documentId}.applicationInput`}
        onOpen={onOpen}
      />
    </div>
  )
}
