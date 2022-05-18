import { DmtUIPlugin, UIPluginSelector } from '@dmt/common'
import * as React from 'react'

export const EditSIMAInput = (props: DmtUIPlugin) => {
  const { document, documentId, dataSourceId } = props
  if (!document?.applicationInput?.input) {
    return <pre style={{ color: 'red' }}>No input exists for the analysis</pre>
  }
  return (
    <div>
      <UIPluginSelector
        absoluteDottedId={`${dataSourceId}/${documentId}.applicationInput.input`}
        entity={document?.applicationInput?.input}
        categories={['edit']}
      />
    </div>
  )
}
