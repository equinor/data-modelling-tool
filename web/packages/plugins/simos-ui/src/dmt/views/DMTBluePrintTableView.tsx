import React, { useEffect, useState } from 'react'

import { DmtUIPlugin, Loading, useBlueprint, useDocument } from '@dmt/common'

import { DMTBluePrintTableView } from './blueprint'

const DMTBluePrintTableView_Component = (props: DmtUIPlugin) => {
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
