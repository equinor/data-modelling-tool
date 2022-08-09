import { AuthContext, DmtSettings, hasDomainRole } from '@dmt/common'
import React, { ReactNode, useContext } from 'react'
import { Divider } from '@equinor/eds-core-react'
import { AssetTable, CreateAssetButton } from './components'

type AssetOverviewProps = {
  settings: DmtSettings
}

export const AssetOverview = (props: AssetOverviewProps): ReactNode => {
  const { settings } = props
  const { tokenData } = useContext(AuthContext)

  return (
    <>
      {hasDomainRole(tokenData) && (
        <CreateAssetButton urlPath={settings.urlPath} />
      )}
      <Divider variant="medium" />
      <AssetTable />
    </>
  )
}
