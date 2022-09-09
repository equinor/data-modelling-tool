import {
  DmtUIPlugin,
  Loading,
  UIPluginSelector,
  useDocument,
} from '@data-modelling-tool/core'
import * as React from 'react'

export const EditInput = (props: DmtUIPlugin) => {
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
