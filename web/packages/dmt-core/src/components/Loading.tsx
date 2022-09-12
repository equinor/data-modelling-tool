import { CircularProgress } from '@equinor/eds-core-react'
import React from 'react'

export const Loading = () => {
  return (
    <div style={{ alignSelf: 'center', padding: '50px' }}>
      <CircularProgress />
    </div>
  )
}
