import * as React from 'react'

import { Loading, useDocument } from '@development-framework/dm-core'
import { IDmtUIPlugin } from '@development-framework/dm-core'

import { SRSSceForm } from './sce.js'

const SRSSceForm_Component = (props: IDmtUIPlugin) => {
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

  // console.log("*** testing form");
  // console.log(dataSourceId)
  // console.log(documentId)
  // console.log(attribute)
  // console.log(document)
  // console.log("*** testing form");

  return <SRSSceForm document={document} updateEntity={updateDocument} />
}

export { SRSSceForm_Component as SRSSceForm }
