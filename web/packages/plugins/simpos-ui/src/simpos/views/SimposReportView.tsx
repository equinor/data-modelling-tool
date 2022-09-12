import * as React from 'react'

import {
  DmtPluginType,
  IDmtUIPlugin,
  Loading,
  useDocument,
} from '@data-modelling-tool/core'

import { SimposReportView } from './report.js'

const SimposReportView_Component = (props: IDmtUIPlugin) => {
  const { dataSourceId, documentId } = props
  const [document, loading, updateDocument, error] = useDocument(
    dataSourceId,
    documentId
  )
  if (loading) return <Loading />
  return <SimposReportView document={document} />
}

export { SimposReportView_Component as SimposReportView }
