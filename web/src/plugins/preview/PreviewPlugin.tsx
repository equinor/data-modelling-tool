import React from 'react'
import { PluginProps } from '../../domain/types'
import JsonView from '../../components/JsonView'
import Button from '../../components/Button'
// @ts-ignore
import { CopyToClipboard } from 'react-copy-to-clipboard'

export default (props: PluginProps) => {
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
