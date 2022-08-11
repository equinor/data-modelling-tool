import { AuthContext, DmtSettings, hasDomainRole } from '@dmt/common'
import React, { ReactNode, useContext } from 'react'
import { Button, Divider } from '@equinor/eds-core-react'
import { AssetTable, CreateAssetButton } from './components'
import { Link, useLocation } from 'react-router-dom'

type AssetOverviewProps = {
  settings: DmtSettings
}

export const AssetOverview = (props: AssetOverviewProps): ReactNode => {
  const { settings } = props
  const { tokenData } = useContext(AuthContext)
  const location = useLocation()
  const to = {
    pathname: `/${settings.urlPath}/analyses`,
    state: location.state,
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
        <Link to={to}>
          <Button>View all analyses</Button>
        </Link>
      </div>

      <Divider variant="medium" />
      <AssetTable />
    </>
  )
}
