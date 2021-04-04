import React from 'react'
import { JsonView, Button } from '@dmt/common'

// @ts-ignore
import { CopyToClipboard } from 'react-copy-to-clipboard'

type PreviewProps = {
  document: any
}

export default (props: PreviewProps) => {
  const { document } = props
  return (
    <div>
      <div style={{ textAlign: 'end' }}>
        <CopyToClipboard text={JSON.stringify(document)}>
          <Button style={{ marginBottom: '5px' }}>Copy</Button>
        </CopyToClipboard>
      </div>

      <JsonView data={document} />
    </div>
  )
}
