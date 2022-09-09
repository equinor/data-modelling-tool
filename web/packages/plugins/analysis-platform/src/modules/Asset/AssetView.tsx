import React from 'react'
import { DmtUIPlugin, useDocument, Loading } from '@data-modelling-tool/core'
import { AssetInfoCard } from './components'
import { AnalysisTable } from '../Analysis'

export const AssetView = (props: DmtUIPlugin): JSX.Element => {
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
