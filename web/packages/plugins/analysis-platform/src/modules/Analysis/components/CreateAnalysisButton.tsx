import React from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Button } from '@equinor/eds-core-react'

import { TCreateButtonProps } from '../../../Types'

export const CreateAnalysisButton = (props: TCreateButtonProps) => {
  const { urlPath } = props
  const location = useLocation()
  const { entity_id } = useParams<{
    entity_id: string
  }>()
  const createNewAnalysisPage = {
    pathname: `/${urlPath}/analysis/new/${entity_id}`,
    state: location.state,
  }
  return (
    <Link to={createNewAnalysisPage}>
      <Button>Create new analysis</Button>
    </Link>
  )
}
