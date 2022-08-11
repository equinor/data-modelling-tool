import React from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Button } from '@equinor/eds-core-react'

import { CreateAnalysisButtonProps } from '../../../Types'

export const CreateAnalysisButton = (props: CreateAnalysisButtonProps) => {
  const { urlPath } = props
  const location = useLocation()
  const { entity_id } = useParams<{
    entity_id: string
  }>()
  const to = {
    pathname: `/${urlPath}/analysis/new/${entity_id}`,
    state: location.state,
  }
  return (
    <Link to={to}>
      <Button>Create new analysis</Button>
    </Link>
  )
}
