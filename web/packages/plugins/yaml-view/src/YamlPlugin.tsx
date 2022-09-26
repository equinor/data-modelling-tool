import React, { useState } from 'react'
import hljs from 'highlight.js'
import yaml from 'highlight.js/lib/languages/yaml'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import jsyaml from 'js-yaml'
import styled, { keyframes } from 'styled-components'
import { Button, TGenericObject } from '@development-framework/dm-core'

hljs.registerLanguage('yaml', yaml)

const tempVisible = keyframes`
  0%, 100% {
    opacity: 0;
  }
  10%, 90% {
    opacity: 1;
  }
`
const TooltipText = styled.div`
  font-size: 0.7rem;
  width: 60px;
  height: 20px;
  background-color: #c1cae0;
  color: #000000;
  text-align: center;
  padding: 2px 0;
  margin-bottom: 6px;
  border-radius: 3px;
  border: black solid 1px;
  z-index: 1;
  animation: ${tempVisible} 2s;
`

export default (props: { document: TGenericObject }) => {
  const { document } = props
  const [showTooltip, setShowTooltip] = useState<boolean>(false)
  const asYAML: string = jsyaml.dump(document)
  const highlighted = hljs.highlight(asYAML, { language: 'yaml' })

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          flexDirection: 'column',
        }}
      >
        <div style={{ position: 'absolute', right: '120px' }}>
          {showTooltip && (
            <TooltipText onAnimationEnd={() => setShowTooltip(false)}>
              Copied!
            </TooltipText>
          )}
        </div>
        <div>
          <CopyToClipboard text={asYAML}>
            <Button onClick={() => setShowTooltip(true)}>Copy as YAML</Button>
          </CopyToClipboard>
          <CopyToClipboard text={JSON.stringify(document)}>
            <Button onClick={() => setShowTooltip(true)}>Copy as JSON</Button>
          </CopyToClipboard>
        </div>
      </div>
      <pre style={{ backgroundColor: '#193549', color: 'coral' }}>
        <code dangerouslySetInnerHTML={{ __html: highlighted.value }} />
      </pre>
    </div>
  )
}
