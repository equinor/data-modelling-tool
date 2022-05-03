import * as React from 'react'

import { useDocument } from '@dmt/common'
import { DmtPluginType, DmtUIPlugin } from '@dmt/common'

import { SimposRunOutputView } from './results.js'
import { SimposStatusView } from './results.js'

const SimposRunOutputView_Component = (props: DmtUIPlugin) => {
  const { document } = props

  return <SimposRunOutputView document={document} />
}

const SimposStatusView_Component = (props: DmtUIPlugin) => {
  const { document } = props

  return <SimposStatusView document={document} />
}

export { SimposRunOutputView_Component as SimposRunOutputView }
export { SimposStatusView_Component as SimposStatusView }
