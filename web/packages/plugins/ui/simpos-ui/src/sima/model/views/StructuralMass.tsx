import React, { useEffect, useState } from 'react'
import { useDocument, DmtUIPlugin } from '@dmt/common'

import { SIMA_Model_StructuralMass } from './StructuralMass_src.js'

const StructuralMass_Component = (props: DmtUIPlugin) => {
  const { dataSourceId, documentId, updateDocument } = props

  const [document, isLoading, setDocument, hasError] = useDocument(
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

  return <SIMA_Model_StructuralMass document={document} />
}

export { StructuralMass_Component as SIMA_Model_StructuralMass }
