import React from 'react'
import { JsonView, Button } from '@dmt/common'

// @ts-ignore
import { CopyToClipboard } from 'react-copy-to-clipboard'

type PreviewProps = {
  document: any
}

export default (props: PreviewProps) => {
  const { document } = props
  let infoText: string = ''

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
