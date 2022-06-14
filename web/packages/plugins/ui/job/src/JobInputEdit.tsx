import {
  DmtUIPlugin,
  EJobStatus,
  Loading,
  TJob,
  UIPluginSelector,
  useDocument,
} from '@dmt/common'
import * as React from 'react'
import { useEffect, useState } from 'react'

export const JobInputEdit = (props: DmtUIPlugin) => {
  const { documentId, dataSourceId, onOpen } = props
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
  if (error) return <div>Something went wrong; {error}</div>
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
