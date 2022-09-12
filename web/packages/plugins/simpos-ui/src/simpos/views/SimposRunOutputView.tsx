import * as React from 'react'

import { Loading, useDocument } from '@data-modelling-tool/core'
import { DmtUIPlugin } from '@data-modelling-tool/core'

import { SimposRunOutputView } from './results.js'
import { SimposStatusView } from './results.js'

const SimposRunOutputView_Component = (props: DmtUIPlugin) => {
  const { documentId, dataSourceId } = props
  const [document, loading, updateDocument, hasError] = useDocument(
    dataSourceId,
    documentId,
    999
  )
  if (loading) {
    return <Loading />
  }
  return <SimposRunOutputView document={document} />
}

const SimposStatusView_Component = (props: DmtUIPlugin) => {
  const { documentId, dataSourceId } = props
  const [document, loading, updateDocument, hasError] = useDocument(
    dataSourceId,
    documentId,
    999
  )
  if (loading) {
    return <Loading />
  }
  return <SimposStatusView document={document} />
}

export { SimposRunOutputView_Component as SimposRunOutputView }
export { SimposStatusView_Component as SimposStatusView }
