import React, { useContext } from 'react'

import { AuthContext, hasExpertRole } from '@dmt/common'
import { TCreateButtonProps, TAssetInfoCardProps } from '../../../Types'
import { DocumentInfoCard } from '../../../components/DocumentInfoCard'
import { CreateAnalysisButton } from '../../Analysis'
import { OnRight } from '../../../components/Design/Styled'

const AssetInfoCardActions = (props: TCreateButtonProps) => {
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
          fields={{
            Contact: asset.contact || '',
            Location: asset.location?.label || asset.location?.name || '',
          }}
          actions={<AssetInfoCardActions urlPath={urlPath} />}
        />
      </OnRight>
    </>
  )
}
