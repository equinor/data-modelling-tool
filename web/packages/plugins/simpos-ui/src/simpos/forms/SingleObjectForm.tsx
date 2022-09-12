import * as React from 'react'

import { Loading, useDocument } from '@data-modelling-tool/core'
import { DmtUIPlugin } from '@data-modelling-tool/core'

import { SingleObjectForm } from './SingleObject.js'

const SingleObjectForm_Component = (props: DmtUIPlugin) => {
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

  return <SingleObjectForm document={document} updateEntity={updateDocument} />
}

export { SingleObjectForm_Component as SingleObjectForm }
