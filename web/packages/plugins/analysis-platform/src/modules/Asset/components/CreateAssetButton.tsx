import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@equinor/eds-core-react'
import { TCreateButtonProps } from '../../../Types'

export const CreateAssetButton = (props: TCreateButtonProps) => {
  const { urlPath } = props
  const location = useLocation()
  const createNewAssetPage = {
    pathname: `/${urlPath}/asset/new`,
    state: location.state,
  }
  return (
    <Link to={createNewAssetPage}>
      <Button>Create new asset</Button>
    </Link>
  )
}
