import * as React from 'react'

import { EDmtPluginType, DmtUIPlugin, Loading, useDocument } from '@dmt/common'

import { SimposReportView } from './report.js'

const SimposReportView_Component = (props: DmtUIPlugin) => {
  const { dataSourceId, documentId } = props
  const [document, loading, updateDocument, error] = useDocument(
    dataSourceId,
    documentId
  )
  if (loading) return <Loading />
  return <SimposReportView document={document} />
}

export { SimposReportView_Component as SimposReportView }
