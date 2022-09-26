import {
  IDmtUIPlugin,
  Loading,
  UIPluginSelector,
  useDocument,
} from '@development-framework/dm-core'
import * as React from 'react'

export const EditInput = (props: IDmtUIPlugin) => {
  const { documentId, dataSourceId, onOpen } = props
  const [document, loading] = useDocument<any>(dataSourceId, documentId)
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
