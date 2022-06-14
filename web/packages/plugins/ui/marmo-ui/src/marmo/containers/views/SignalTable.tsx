import React, { useEffect, useState } from 'react'
import { useDocument, DmtUIPlugin, Loading } from '@dmt/common'

import { SignalTable } from './SignalTable_src.js'

const SignalTable_Component = (props: DmtUIPlugin) => {
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

  return <SignalTable document={document} />
}

export { SignalTable_Component as SignalTable }
