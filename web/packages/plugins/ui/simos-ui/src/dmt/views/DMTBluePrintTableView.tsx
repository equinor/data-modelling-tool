import React, { useEffect, useState } from 'react'

import { DmtUIPlugin } from '@dmt/core-plugins'

import { DMTBluePrintTableView } from './blueprint.js'

const DMTBluePrintTableView_Component = (props: DmtUIPlugin) => {
  const { document, fetchBlueprint } = props

  // Since fetchBlueprint is returning a promise,
  // we need to wait for it,
  // and after resolving,
  // we set the result in a state,
  // so that the react component will re-render
  // when promise is resolved.
  const [blueprint, setBlueprint] = useState()
  useEffect(() => {
    fetchBlueprint(document.type).then((result) => {
      setBlueprint(result)
    })
  }, [])

  if (!blueprint) {
    return <>Loading...</>
  }

  return <DMTBluePrintTableView document={blueprint} />
}

export { DMTBluePrintTableView_Component as DMTBluePrintTableView }
