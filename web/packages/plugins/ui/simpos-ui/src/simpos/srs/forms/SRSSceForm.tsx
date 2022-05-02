import * as React from 'react'

import { useDocument } from '@dmt/common'
import { DmtPluginType, DmtUIPlugin } from '@dmt/common'

import { SRSSceForm } from './sce.js'

const SRSSceForm_Component = (props: DmtUIPlugin) => {
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

  // console.log("*** testing form");
  // console.log(dataSourceId)
  // console.log(documentId)
  // console.log(attribute)
  // console.log(document)
  // console.log("*** testing form");

  return <SRSSceForm document={document} updateEntity={updateDocument} />
}

export { SRSSceForm_Component as SRSSceForm }
