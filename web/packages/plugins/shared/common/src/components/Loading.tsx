import { CircularProgress } from '@equinor/eds-core-react'
import React from 'react'
export const Loading = () => {
  return (
    <div style={{ textAlign: 'center', paddingTop: '50px' }}>
      <CircularProgress />
    </div>
  )
}
