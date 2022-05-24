import React, { useEffect, useState } from 'react'

import { DmtUIPlugin, useBlueprint } from '@dmt/common'

import { DMTBluePrintTableView } from './blueprint.js'

const DMTBluePrintTableView_Component = (props: DmtUIPlugin) => {
  const { document } = props
  const [blueprint, isLoading, error] = useBlueprint(document.type)

  if (!blueprint) {
    return <>Loading...</>
  }

  return <DMTBluePrintTableView document={blueprint} />
}

export { DMTBluePrintTableView_Component as DMTBluePrintTableView }
