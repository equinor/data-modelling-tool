import {
  IDmtUIPlugin,
  EJobStatus,
  Loading,
  TJob,
  UIPluginSelector,
  useDocument,
} from '@development-framework/dm-core'
import * as React from 'react'
import { useEffect, useState } from 'react'

export const JobInputEdit = (props: IDmtUIPlugin) => {
  const { documentId, dataSourceId } = props
  const [document, documentLoading, updateDocument, error] = useDocument<TJob>(
    dataSourceId,
    documentId
  )
  const [formData, setFormData] = useState<TJob | null>(null)

  useEffect(() => {
    if (!document) return
    setFormData(document)
  }, [document])

  if (documentLoading) return <Loading />
  if (error) {
    const errorResponse =
      typeof error.response?.data == 'object'
        ? error.response?.data?.message
        : error.response?.data
    return (
      <div>
        <div>Something went wrong when fetching document: </div>
        {errorResponse}
      </div>
    )
  }
  if (!formData) return <div>The job document is empty</div>

  if (formData.status !== EJobStatus.CREATED) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px',
        }}
      >
        <h4>Can't edit job parameters after job has been started</h4>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        {Object.keys(formData.applicationInput || {}).length ? (
          <UIPluginSelector
            type={formData.applicationInput.type}
            absoluteDottedId={`${dataSourceId}/${formData.applicationInput._id}`}
            categories={['edit']}
            onSubmit={(data: any) =>
              updateDocument({ ...formData, applicationInput: data }, true)
            }
            referencedBy={`${dataSourceId}/${documentId}.applicationInput`}
          />
        ) : (
          <pre style={{ color: 'red' }}>
            The jobs has no value for the "applicationInput" attribute
          </pre>
        )}
      </div>
    </div>
  )
}
