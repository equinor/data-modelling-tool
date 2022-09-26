import React, { useContext } from 'react'

import { AuthContext, hasExpertRole } from '@development-framework/dm-core'
import { TAssetInfoCardProps } from '../../../Types'
import { DocumentInfoCard } from '../../../components/DocumentInfoCard'
import { CreateAnalysisButton } from '../../Analysis'
import { OnRight } from '../../../components/Design/Styled'

const AssetInfoCardActions = () => {
  const { tokenData } = useContext(AuthContext)
  return <>{hasExpertRole(tokenData) && <CreateAnalysisButton />}</>
}

export const AssetInfoCard = (props: TAssetInfoCardProps) => {
  const { asset, dataSourceId } = props

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
          actions={<AssetInfoCardActions />}
        />
      </OnRight>
    </>
  )
}
