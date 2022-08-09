import { AuthContext, DmtSettings, hasDomainRole } from '@dmt/common'
import React, { ReactNode, useContext } from 'react'
import { AnalysisTable } from '../Analysis/components'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Button, Divider } from '@equinor/eds-core-react'

type NewAnalysisButtonProps = {
  urlPath: string
}

const NewAnalysisButton = (props: NewAnalysisButtonProps) => {
  const { urlPath } = props
  const location = useLocation()
  const to = {
    pathname: `/${urlPath}/analysis/new`,
    state: location.state,
  }
  return (
    <Link to={to}>
      <Button>Create new analysis</Button>
    </Link>
  )
}

type AssetViewProps = {
  settings: DmtSettings
}

export const AssetView = (props: AssetViewProps): ReactNode => {
  const { data_source, entity_id } = useParams<{
    data_source: string
    entity_id: string
  }>()
  const { settings } = props
  const { tokenData } = useContext(AuthContext)

  return (
    <>
      {hasDomainRole(tokenData) && (
        <NewAnalysisButton urlPath={settings.urlPath} />
      )}
      <Divider variant="medium" />
      <AnalysisTable />
    </>
  )
}
