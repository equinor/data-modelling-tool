import { AuthContext, DmtSettings, hasDomainRole } from '@dmt/common'
import React, { ReactNode, useContext } from 'react'
import { AnalysisTable } from './components'
import { Link, useLocation } from 'react-router-dom'
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

type AnalysisOverviewProps = {
  settings: DmtSettings
}

export const AnalysisOverview = (props: AnalysisOverviewProps): ReactNode => {
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
