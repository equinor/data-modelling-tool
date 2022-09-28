import * as React from 'react'

import { Loading, useDocument } from '@development-framework/dm-core'
import { IDmtUIPlugin } from '@development-framework/dm-core'

import { SignalESSForm } from './signaless_src.js'

const SignalESSForm_Component = (props: IDmtUIPlugin) => {
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

  return <SignalESSForm document={document} updateEntity={updateDocument} />
}

export { SignalESSForm_Component as SignalESSForm }
