import {
  DmtUIPlugin,
  Loading,
  UIPluginSelector,
  useDocument,
} from '@dmt/common'
import * as React from 'react'

export const EditSIMAInput = (props: DmtUIPlugin) => {
  const { documentId, dataSourceId } = props
  const [document, loading, updateDocument, error] = useDocument<any>(
    dataSourceId,
    documentId
  )
  if (loading) {
    return <Loading />
  }
  if (!document?.applicationInput?.input) {
    return <pre style={{ color: 'red' }}>No input exists for the analysis</pre>
  }
  return (
    <div>
      <UIPluginSelector
        absoluteDottedId={`${dataSourceId}/${documentId}.applicationInput.input`}
        type={document?.applicationInput?.input.type}
        categories={['edit']}
      />
    </div>
  )
}
