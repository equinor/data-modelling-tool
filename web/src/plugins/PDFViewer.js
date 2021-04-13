import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { formatBytes } from '../utils/formatBytes'
import { dmssApi } from '../services/api/configs/StorageServiceAPI'
import { ErrorGroup } from '../components/Wrappers'

const MetaDataWrapper = styled.div`
  margin-right: 10px;
`

const TagWrapper = styled.div`
  border-radius: 5px;
  border: #282c34 solid 1px;
  padding: 0 5px;
  background: #d8d8dc;
  margin: 0 3px;
  height: 22px;
`

export const ViewerPDFPlugin = props => {
  const document = props.document
  const [dataSourceId, blobId] = document.blob_reference.split('/')

  const [blobUrl, setBlobUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setError(null)
    dmssApi
      .blobGetById({ dataSourceId, blobId })
      .then(result => {
        const blob = new Blob([result], { type: 'application/pdf' })
        setBlobUrl(window.URL.createObjectURL(blob))
        setLoading(false)
      })
      .catch(error => {
        console.error(error)
        setError(error?.message)
      })
  }, [props.document.blob_reference])

  if (error)
    return (
      <ErrorGroup>
        <b>Error</b>
        <b>
          Failed to load PDF...
          <div>
            <code>{error}</code>
          </div>
        </b>
      </ErrorGroup>
    )

  return (
    <>
      {loading ? (
        <>Loading...</>
      ) : (
        <>
          <div style={{ display: 'flex', fontSize: '16px' }}>
            <MetaDataWrapper>
              <label>Title:</label> {document.name}
            </MetaDataWrapper>
            <MetaDataWrapper>
              <label>Description:</label> {document.description}
            </MetaDataWrapper>
            <MetaDataWrapper>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <label>Tags:</label>
                {document.tags &&
                  document.tags.map(tag => {
                    return <TagWrapper>{tag}</TagWrapper>
                  })}
              </div>
            </MetaDataWrapper>
            <MetaDataWrapper>
              <label>Size:</label> {document.size && formatBytes(document.size)}
            </MetaDataWrapper>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <a href={blobUrl} target={'_blank'}>
              Open in new tab
            </a>
          </div>
          <iframe
            src={blobUrl}
            style={{ width: '100%', height: `${window.screen.height * 0.8}px` }}
          />
        </>
      )}
    </>
  )
}
