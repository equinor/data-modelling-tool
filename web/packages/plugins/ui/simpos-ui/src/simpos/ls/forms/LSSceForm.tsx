import * as React from 'react'

import { useDocument } from '@dmt/common'
import { DmtPluginType, DmtUIPlugin } from '@dmt/common'

import { LSSceForm } from './sce.js'

const LSSceForm_Component = (props: DmtUIPlugin) => {
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

  // console.log("*** testing form");
  // console.log(dataSourceId)
  // console.log(documentId)
  // console.log(attribute)
  // console.log(document)
  // console.log("*** testing form");

  return <LSSceForm document={document} updateEntity={updateDocument} />
}

export { LSSceForm_Component as LSSceForm }
