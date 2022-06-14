import React from 'react'
import { JsonView, Button, useDocument, Loading } from '@dmt/common'

// @ts-ignore
import { CopyToClipboard } from 'react-copy-to-clipboard'

type PreviewProps = {
  documentId: string
  dataSourceId: string
}

export default (props: PreviewProps) => {
  const { documentId, dataSourceId } = props
  const [document, loading] = useDocument(dataSourceId, documentId)
  let infoText: string = ''
  if (loading) {
    return <Loading />
  }
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          color: '#9e4949',
        }}
      >
        {infoText && <small>{infoText}</small>}
        <CopyToClipboard text={JSON.stringify(document)}>
          <Button style={{ marginBottom: '5px' }}>Copy</Button>
        </CopyToClipboard>
      </div>

      <JsonView data={document} />
    </div>
  )
}
