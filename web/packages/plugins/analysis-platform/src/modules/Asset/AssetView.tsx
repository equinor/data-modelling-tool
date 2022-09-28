import React from 'react'
import {
  IDmtUIPlugin,
  useDocument,
  Loading,
} from '@development-framework/dm-core'
import { AssetInfoCard } from './components'
import { AnalysisTable } from '../Analysis'

export const AssetView = (props: IDmtUIPlugin): JSX.Element => {
  const { documentId, dataSourceId } = props
  const [asset, loading] = useDocument(dataSourceId, documentId)

  if (loading) {
    return <Loading />
  }
  return (
    <>
      <AssetInfoCard
        asset={asset}
        analyses={asset.analyses}
        dataSourceId={dataSourceId}
      />
      <AnalysisTable analyses={asset.analyses} />
    </>
  )
}
