import React, { useEffect, useState } from 'react'
import { useDocument, DmtUIPlugin, Loading } from '@dmt/common'

import { SignalPlot } from './SignalPlot_src'

const SignalPlot_Component = (props: DmtUIPlugin) => {
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
