import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@equinor/eds-core-react'

export const CreateAnalysisButton = () => {
  const { entity_id } = useParams<{
    entity_id: string
  }>()
  return (
    <Link to={entity_id ? `/ap/analysis/new/${entity_id}` : '/ap/analysis/new'}>
      <Button>Create new analysis</Button>
    </Link>
  )
}
