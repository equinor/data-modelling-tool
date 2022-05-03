import React, { useEffect, useState } from 'react'
import { useDocument } from '@dmt/common'
import { DmtUIPlugin } from '@dmt/core-plugins'

import { SignalTable } from './SignalTable_src.js'

const SignalTable_Component = (props: DmtUIPlugin) => {
  const { dataSourceId, documentId, attribute, updateDocument } = props

  const [document, isLoading, setDocument, hasError] = useDocument(
    dataSourceId,
    documentId,
    attribute
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
