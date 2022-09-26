import * as React from 'react'

import { Loading, useDocument } from '@development-framework/dm-core'
import { IDmtUIPlugin } from '@development-framework/dm-core'

import { RAOSceForm } from './raoSce.js'

const RAOSceForm_Component = (props: IDmtUIPlugin) => {
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

  return <RAOSceForm document={document} updateEntity={updateDocument} />
}

export { RAOSceForm_Component as RAOSceForm }
