import { DmtUIPlugin, Loading, UIPluginSelector, useDocument } from '@dmt/common'
import * as React from 'react'

export const EditInput = (props: DmtUIPlugin) => {
  const { documentId, dataSourceId, onOpen } = props
    const [document, loading, updateDocument, error] = useDocument<any>(
    dataSourceId,
    documentId
  )
    if (loading) {
    return <Loading />
  }
  if (!document?.applicationInput) {
    return <pre style={{ color: 'red' }}>No input exists for the analysis</pre>
  }
  return (
    <div>
      <UIPluginSelector
        absoluteDottedId={`${dataSourceId}/${documentId}.applicationInput`}
        type={document?.applicationInput.type}
        categories={['edit']}
        referencedBy={`${dataSourceId}/${documentId}.applicationInput`}
        onOpen={onOpen}
      />
    </div>
  )
}
