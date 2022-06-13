import * as React from 'react'

import { DmtPluginType, DmtUIPlugin, useDocument } from '@dmt/common'

import { SimposReportView } from './report.js'

const SimposReportView_Component = (props: DmtUIPlugin) => {
  const { dataSourceId, documentId } = props
  const [document, documentLoading, updateDocument, error] = useDocument(
    dataSourceId,
    documentId
  )
  if (!document) return <>Loading...</>
  return <SimposReportView document={document} />
}

export { SimposReportView_Component as SimposReportView }
