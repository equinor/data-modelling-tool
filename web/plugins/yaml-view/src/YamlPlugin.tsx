import React from 'react'
import hljs from 'highlight.js/lib/core'
import yaml from 'highlight.js/lib/languages/yaml'
// @ts-ignore
import { CopyToClipboard } from 'react-copy-to-clipboard'

import jsyaml from 'js-yaml'
import Tooltip from './Tooltip'

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
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <CopyToClipboard text={asYAML}>
          <Tooltip text={'Copy as YAML'} tooltipText={'Copied!'} />
        </CopyToClipboard>
        <CopyToClipboard text={JSON.stringify(document)}>
          <Tooltip text={'Copy as JSON'} tooltipText={'Copied!'} />
        </CopyToClipboard>
      </div>
      <pre style={{ backgroundColor: '#193549', color: 'coral' }}>
        <code dangerouslySetInnerHTML={{ __html: highlighted.value }} />
      </pre>
    </div>
  )
}
