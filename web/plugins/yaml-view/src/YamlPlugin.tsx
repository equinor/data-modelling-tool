import React from 'react'
import hljs from 'highlight.js/lib/core'
import yaml from 'highlight.js/lib/languages/yaml'
// @ts-ignore
import { CopyToClipboard } from 'react-copy-to-clipboard'

import jsyaml from 'js-yaml'

hljs.registerLanguage('yaml', yaml)

type PreviewProps = {
  document: any
}

export default (props: PreviewProps) => {
  const { document } = props

  const asYAML: string = jsyaml.dump(document)
  const highlighted = hljs.highlight('yaml', asYAML)

  return (
    <div>
      <div style={{ textAlign: 'end' }}>
        <CopyToClipboard text={asYAML}>
          <button style={{ marginBottom: '5px' }}>Copy</button>
        </CopyToClipboard>
      </div>
      <pre style={{ backgroundColor: '#193549', color: 'coral' }}>
        <code dangerouslySetInnerHTML={{ __html: highlighted.value }} />
      </pre>
    </div>
  )
}
