import React, { useEffect, useState, useContext } from 'react'
import {
  ApplicationContext,
  DmtUIPlugin,
  useDocument,
  Loading,
} from '@dmt/common'
import { AssetInfoCard } from './components'
import { AnalysisTable } from '../Analysis'

export const AssetView = (props: DmtUIPlugin): JSX.Element => {
  const { documentId, dataSourceId } = props
  const settings = useContext(ApplicationContext)
  const [analyses, setAnalyses] = useState<any[]>([])
  const [asset, setAsset] = useState<any>()
  const [document, loading] = useDocument(dataSourceId, documentId)

  useEffect(() => {
    if (!document) return
    setAsset(document)
  }, [document])

  useEffect(() => {
    if (!asset) return
    setAnalyses(asset.analyses)
  }, [asset])
  if (loading) {
    return <Loading />
  }
  return (
    <>
      <AssetInfoCard
        asset={asset}
        analyses={analyses}
        dataSourceId={dataSourceId}
        urlPath={settings.urlPath}
      />
      <AnalysisTable analyses={analyses} />
    </>
  )
}
