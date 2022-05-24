import * as React from 'react'

import { useDocument } from '@dmt/common'
import { DmtUIPlugin } from '@dmt/common'

import { RAOSceForm } from './raoSce.js'

const RAOSceForm_Component = (props: DmtUIPlugin) => {
  const { dataSourceId, documentId, updateDocument } = props

  const [document, isLoading, hasError] = useDocument(
    dataSourceId,
    documentId,
    true
  )

  if (isLoading) {
    return <div>Loading document...</div>
  }

  if (hasError) {
    return <div>Error getting the document</div>
  }

  return <RAOSceForm document={document} updateEntity={updateDocument} />
}

export { RAOSceForm_Component as RAOSceForm }
