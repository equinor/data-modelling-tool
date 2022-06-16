import * as React from 'react'

import { Loading, useDocument } from '@dmt/common'
import { DmtUIPlugin } from '@dmt/common'

import { SRSSceSimulationForm } from './sce_simulation.js'

const SRSSceSimulationForm_Component = (props: DmtUIPlugin) => {
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
