import React from 'react'

import { Checkbox } from '@equinor/eds-core-react'

const CheckboxWidget = (props: any) => {
  const { label, value } = props

  return (
    <Checkbox
      {...props}
      label={label}
      checked={typeof value === 'undefined' ? false : value}
      type="checkbox"
    />
  )
}

export default CheckboxWidget
