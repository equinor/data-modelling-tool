import React from 'react'
import { JsonView, Button } from '@dmt/common'

// @ts-ignore
import { CopyToClipboard } from 'react-copy-to-clipboard'

type PreviewProps = {
  document: any
  uiRecipe: any
}

export default (props: PreviewProps) => {
  const { document, uiRecipe } = props
  let infoText: string = ''
  if (uiRecipe?.options) {
    const infoOption: string = uiRecipe.options.find((v: string) =>
      v.includes('info=')
    )
    infoText = infoOption.split('=')[1]
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          color: '#f75959',
        }}
      >
        {infoText && <p>{infoText}</p>}
        <CopyToClipboard text={JSON.stringify(document)}>
          <Button style={{ marginBottom: '5px' }}>Copy</Button>
        </CopyToClipboard>
      </div>

      <JsonView data={document} />
    </div>
  )
}
