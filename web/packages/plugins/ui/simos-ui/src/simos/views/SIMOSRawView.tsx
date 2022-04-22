import * as React from 'react'

import { useDocument } from '@dmt/common'
import { DmtPluginType, DmtUIPlugin } from '@dmt/common'

import { SIMOSRawView } from './raw.js'

const SIMOSRawView_Component = (props: DmtUIPlugin) => {
  const { document } = props

  return <SIMOSRawView document={document} />
}

export { SIMOSRawView_Component as SIMOSRawView }
