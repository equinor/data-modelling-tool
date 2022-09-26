import { IDmtUIPlugin } from '@development-framework/dm-core'
import * as React from 'react'

import { EditSimaApplicationInput } from './EditSimaApplicationInput'

export const ViewSimaApplicationInput = (props: IDmtUIPlugin) => {
  const { dataSourceId, documentId } = props

  return (
    <EditSimaApplicationInput
      dataSourceId={dataSourceId}
      documentId={documentId}
      readOnly={true}
    />
  )
}
