import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@equinor/eds-core-react'

type CreateAssetButtonProps = {
  urlPath: string
}

export const CreateAssetButton = (props: CreateAssetButtonProps) => {
  const { urlPath } = props
  const location = useLocation()
  const to = {
    pathname: `/${urlPath}/asset/new`,
    state: location.state,
  }
  return (
    <Link to={to}>
      <Button>Create new asset</Button>
    </Link>
  )
}
