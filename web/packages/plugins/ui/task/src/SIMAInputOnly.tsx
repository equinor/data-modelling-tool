import { DmtUIPlugin, UIPluginSelector } from '@dmt/common'
import * as React from 'react'

export const EditSIMAInput = (props: DmtUIPlugin) => {
  const { document, documentId, dataSourceId, onSubmit } = props
  if (!document?.applicationInput?.input) {
    return <pre style={{ color: 'red' }}>No input exists for the analysis</pre>
  }
  if (!onSubmit) {
    throw new Error(
      'EditSIMAInput UI plugin must have an onSubmit function as props'
    )
  }
  return (
    <div>
      <UIPluginSelector
        absoluteDottedId={`${dataSourceId}/${documentId}.applicationInput.input`}
        entity={document?.applicationInput?.input}
        categories={['edit']}
        onSubmit={() => onSubmit()}
      />
    </div>
  )
}
