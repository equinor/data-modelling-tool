import React, { useEffect, useState } from 'react'
import { useDocument, DmtUIPlugin } from '@dmt/common'

import { SignalPlot } from './SignalPlot_src.js'

const SignalPlot_Component = (props: DmtUIPlugin) => {
  const { dataSourceId, documentId, updateDocument } = props

  const [document, isLoading, setDocument, hasError] = useDocument(
    dataSourceId,
    documentId,
    true
  )

  if (isLoading) {
    return <div>Loading document...</div>
  }

  if (hasError) {
    return <div>Error getting the document</div>
  }

  return <SignalPlot document={document} />
}

export { SignalPlot_Component as SignalPlot }
