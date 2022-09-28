import React, { useEffect, useState } from 'react'

import {
  IDmtUIPlugin,
  Loading,
  useBlueprint,
  useDocument,
} from '@development-framework/dm-core'

import { DMTBluePrintTableView } from './blueprint.js'

const DMTBluePrintTableView_Component = (props: IDmtUIPlugin) => {
  const { documentId, dataSourceId } = props
  const [type, setType] = useState<string>('')
  const [blueprint, loadingBlueprint, error] = useBlueprint(type)
  const [document, loadingDocument] = useDocument(dataSourceId, documentId)

  useEffect(() => {
    if (!document) return
    setType(document.type)
  }, [document])

  if (loadingDocument || loadingBlueprint) {
    return <Loading />
  }

  return <DMTBluePrintTableView document={blueprint} />
}

export { DMTBluePrintTableView_Component as DMTBluePrintTableView }
