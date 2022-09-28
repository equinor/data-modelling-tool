import React, { useEffect, useState } from 'react'
import {
  useDocument,
  IDmtUIPlugin,
  Loading,
} from '@development-framework/dm-core'

import { SignalPlot } from './SignalPlot_src.js'

const SignalPlot_Component = (props: IDmtUIPlugin) => {
  const { dataSourceId, documentId } = props

  const [document, loading, updateDocument, hasError] = useDocument(
    dataSourceId,
    documentId,
    999
  )

  if (loading) {
    return <Loading />
  }

  if (hasError) {
    return <div>Error getting the document</div>
  }

  return <SignalPlot document={document} />
}

export { SignalPlot_Component as SignalPlot }
