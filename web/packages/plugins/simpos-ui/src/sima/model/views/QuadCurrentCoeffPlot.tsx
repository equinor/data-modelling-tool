import React, { useEffect, useState } from 'react'
import { useDocument, DmtUIPlugin, Loading } from '@data-modelling-tool/core'

import { SIMA_Model_QuadCurrentCoeffPlot } from './QuadCurrentCoeffPlot_src.js'

export const SignalPlot_Component = (props: DmtUIPlugin) => {
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

  return <SIMA_Model_QuadCurrentCoeffPlot document={document} />
}
