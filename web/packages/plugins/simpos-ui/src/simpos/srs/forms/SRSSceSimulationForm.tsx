import * as React from 'react'

import { Loading, useDocument } from '@development-framework/dm-core'
import { IDmtUIPlugin } from '@development-framework/dm-core'

import { SRSSceSimulationForm } from './sce_simulation.js'

const SRSSceSimulationForm_Component = (props: IDmtUIPlugin) => {
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

  return (
    <SRSSceSimulationForm document={document} updateEntity={updateDocument} />
  )
}

export { SRSSceSimulationForm_Component as SRSSceSimulationForm }
