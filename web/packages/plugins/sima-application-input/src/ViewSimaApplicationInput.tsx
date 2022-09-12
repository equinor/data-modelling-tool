import { DmtUIPlugin } from '@data-modelling-tool/core'
import * as React from 'react'

import { EditSimaApplicationInput } from './EditSimaApplicationInput'

export const ViewSimaApplicationInput = (props: DmtUIPlugin) => {
  const { dataSourceId, documentId } = props

  return (
    <EditSimaApplicationInput
      dataSourceId={dataSourceId}
      documentId={documentId}
      readOnly={true}
    />
  )
}
