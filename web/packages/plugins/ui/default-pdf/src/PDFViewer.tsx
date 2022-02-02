import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { formatBytes } from './formatBytes'
import { AuthContext, DmssAPI } from '@dmt/common'

export const ErrorGroup = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(213, 18, 18, 0.71);
  border-radius: 5px;
  padding: 20px 20px;
  background-color: #f6dfdf;
`

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

export const ViewerPDFPlugin = (props: any) => {
  const { document, dataSourceId } = props
  const [blobUrl, setBlobUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // @ts-ignore-line
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)

  useEffect(() => {
    setError(null)
    dmssAPI
      .blobGetById({ dataSourceId, blobId: document.blob._blob_id })
      .then((result: Blob) => {
        // @ts-ignore
        const blob = new Blob([result], { type: 'application/pdf' })
        // @ts-ignore
        setBlobUrl(window.URL.createObjectURL(blob))
      })
      .catch((error: any) => {
        console.error(error)
        setError(error?.message)
      })
      .finally(() => setLoading(false))
  }, [props.blob_reference])

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

  if (loading) return <>Loading...</>

  return (
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
              document.tags.map((tag: any) => {
                return <TagWrapper key={tag}>{tag}</TagWrapper>
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
  )
}