import React, { useEffect, useState } from 'react'
import { useDocument, DmtUIPlugin } from '@dmt/common'

import { SIMA_Model_SIMOBody } from './SIMOBody_src.js'

export const SIMA_Model_SIMOBody_Component = (props: DmtUIPlugin) => {
  const { dataSourceId, documentId, updateDocument } = props

  const [document, isLoading, setDocument, hasError] = useDocument(
    dataSourceId,
    documentId,
    999
  )

  if (isLoading) {
    return <div>Loading document...</div>
  }

  if (hasError) {
    return <div>Error getting the document</div>
  }

  return <SIMA_Model_SIMOBody document={document} />
}
