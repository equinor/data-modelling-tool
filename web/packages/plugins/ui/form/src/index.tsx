import * as React from 'react'

import { DmtPluginType, DmtUIPlugin } from '@dmt/common'
import { Form } from './Form'

const PluginComponent = (props: DmtUIPlugin) => {
  const { document, config, onSubmit } = props

  // TODO: Use config to customize the form
  // @ts-ignore
  return <Form type={document.type} formData={document} onSubmit={onSubmit} />
}

export const plugins: any = [
  {
    pluginName: 'form',
    pluginType: DmtPluginType.UI,
    content: {
      component: PluginComponent,
    },
  },
]
