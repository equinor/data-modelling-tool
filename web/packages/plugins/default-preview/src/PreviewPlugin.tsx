import React from 'react'
import {
  JsonView,
  Button,
  useDocument,
  Loading,
  TGenericObject,
} from '@development-framework/dm-core'

// @ts-ignore
import { CopyToClipboard } from 'react-copy-to-clipboard'

type TPreviewProps = {
  documentId: string
  dataSourceId: string
}

export default (props: TPreviewProps) => {
  const { documentId, dataSourceId } = props
  const [document, loading] = useDocument<TGenericObject>(
    dataSourceId,
    documentId
  )
  const infoText: string = ''
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
