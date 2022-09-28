import {
  IDmtUIPlugin,
  Loading,
  useDocument,
} from '@development-framework/dm-core'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Button, Progress, Typography } from '@equinor/eds-core-react'
import { EditInputEntity, GroupWrapper } from './components'

export const UpdateInputOnly = (props: IDmtUIPlugin) => {
  const { dataSourceId, onOpen, documentId } = props
  const [formData, setFormData] = useState<any>(null)
  const [document, loading, updateDocument] = useDocument(
    dataSourceId,
    documentId
  )

  useEffect(() => {
    if (!document) return
    setFormData(document)
  }, [document])

  if (loading) return <Loading />

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'left',
        flexDirection: 'column',
        margin: '10px 20px',
      }}
    >
      <Typography variant="h3">Input</Typography>
      <GroupWrapper>
        <EditInputEntity
          formData={formData}
          setFormData={setFormData}
          dataSourceId={dataSourceId}
          onOpen={onOpen}
        />
      </GroupWrapper>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {loading ? (
          <Button>
            <Progress.Dots />
          </Button>
        ) : (
          <Button as="button" onClick={() => updateDocument(formData, true)}>
            Save
          </Button>
        )}
      </div>
    </div>
  )
}
