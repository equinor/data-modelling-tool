import React, { useContext } from 'react'

import { AuthContext, hasExpertRole } from '@dmt/common'
import {
  CreateAnalysisButtonProps,
  TAsset,
  TAssetInfoCardProps,
} from '../../../Types'
import { DocumentInfoCard } from '../../../components/DocumentInfoCard'
import { CreateAnalysisButton } from '../../Analysis'
import { OnRight } from '../../../components/Design/Styled'

const assetInfoCardFields = (asset: TAsset) => {
  return {
    Responsible: asset.responsible || '',
    Location: asset.location?.label || asset.location?.name || '',
  }
}

const AssetInfoCardActions = (props: CreateAnalysisButtonProps) => {
  const { urlPath } = props
  const { tokenData } = useContext(AuthContext)
  return (
    <>
      {hasExpertRole(tokenData) && <CreateAnalysisButton urlPath={urlPath} />}
    </>
  )
}

export const AssetInfoCard = (props: TAssetInfoCardProps) => {
  const { asset, dataSourceId, urlPath } = props

  return (
    <>
      <OnRight>
        <DocumentInfoCard
          document={asset}
          dataSourceId={dataSourceId}
          fields={assetInfoCardFields(asset)}
          actions={<AssetInfoCardActions urlPath={urlPath} />}
        />
      </OnRight>
    </>
  )
}
