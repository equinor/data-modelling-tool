import {
  AuthContext,
  DmtSettings,
  hasDomainRole,
  useSearch,
  Loading,
} from '@dmt/common'
import React, { ReactNode, useContext } from 'react'
import { Button, Divider } from '@equinor/eds-core-react'
import { AssetTable, CreateAssetButton } from './components'
import { Link, useLocation } from 'react-router-dom'
import { TAsset } from '../../Types'
import { EBlueprints } from '../../Enums'
import { DEFAULT_DATASOURCE_ID } from '../../const'

type AssetOverviewProps = {
  settings: DmtSettings
}

export const AssetOverview = (props: AssetOverviewProps): ReactNode => {
  const { settings } = props
  const { tokenData } = useContext(AuthContext)
  const location = useLocation()
  const analysisOverviewPage = {
    pathname: `/${settings.urlPath}/analyses`,
    state: location.state,
  }
  const [assets, isLoading] = useSearch<TAsset>(
    {
      type: EBlueprints.ASSET,
    },
    DEFAULT_DATASOURCE_ID
  )

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {hasDomainRole(tokenData) && (
          <CreateAssetButton urlPath={settings.urlPath} />
        )}
        <Link to={analysisOverviewPage}>
          <Button>View all analyses</Button>
        </Link>
      </div>

      <Divider variant="medium" />
      <AssetTable assets={assets} />
    </>
  )
}
