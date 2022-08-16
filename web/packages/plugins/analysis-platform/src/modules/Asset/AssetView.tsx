import React, { useContext } from 'react'
import {
  ApplicationContext,
  DmtUIPlugin,
  useDocument,
  Loading,
  DmtSettings,
} from '@dmt/common'
import { AssetInfoCard } from './components'
import { AnalysisTable } from '../Analysis'

export const AssetView = (props: DmtUIPlugin): JSX.Element => {
  const { documentId, dataSourceId } = props
  const settings: DmtSettings = useContext(ApplicationContext)
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
        urlPath={settings.urlPath}
      />
      <AnalysisTable analyses={asset.analyses} />
    </>
  )
}
