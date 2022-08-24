import React from 'react'

import { TextField, Icon } from '@equinor/eds-core-react'

import { error_filled } from '@equinor/eds-icons'

Icon.add({ error_filled })

const TextareaWidget = (props: any) => {
  const { label, onChange } = props

  const _onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => onChange(value === '' ? '' : value)
  return (
    <TextField
      {...props}
      multiline={true}
      rows={5}
      onChange={_onChange}
      label={label}
    />
  )
}

export default TextareaWidget
