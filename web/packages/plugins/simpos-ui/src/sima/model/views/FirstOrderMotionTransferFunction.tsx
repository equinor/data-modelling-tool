import React, { useEffect, useState } from 'react'
import {
  useDocument,
  IDmtUIPlugin,
  Loading,
} from '@development-framework/dm-core'

import { SIMA_Model_FirstOrderMotionTransferFunction } from './FirstOrderMotionTransferFunction_src.js'

const FirstOrderMotionTransferFunction_Component = (props: IDmtUIPlugin) => {
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

  return <SIMA_Model_FirstOrderMotionTransferFunction document={document} />
}

export { FirstOrderMotionTransferFunction_Component as SIMA_Model_FirstOrderMotionTransferFunction }
