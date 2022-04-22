import * as React from 'react'

import { useDocument } from '@dmt/common'
import { DmtPluginType, DmtUIPlugin } from '@dmt/common'

import { SimposReportView } from './report.js'

const SimposReportView_Component = (props: DmtUIPlugin) => {
  const { document } = props

  return <SimposReportView document={document} />
}

export { SimposReportView_Component as SimposReportView }
