import React, { useEffect, useState } from 'react'
import { useDocument, DmtUIPlugin } from '@dmt/common'

import { SignalTable } from './SignalTable_src.js'

const SignalTable_Component = (props: DmtUIPlugin) => {
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

  return <SignalTable document={document} />
}

export { SignalTable_Component as SignalTable }
