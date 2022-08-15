import React, { useEffect, useState } from 'react'
import { useDocument, DmtUIPlugin, Loading } from '@dmt/common'

import { SIMA_Model_SIMOBody } from './SIMOBody_src.js'

export const SIMA_Model_SIMOBody_Component = (props: DmtUIPlugin) => {
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

  return <SIMA_Model_SIMOBody document={document} />
}
