import React from 'react'

import { TextField, Icon } from '@equinor/eds-core-react'

import { error_filled } from '@equinor/eds-icons'

Icon.add({ error_filled })

type TextareaWidgetProps = {
  label: string
  onChange: (value: any) => void
}

const TextareaWidget = (props: TextareaWidgetProps) => {
  const { label, onChange } = props

  const _onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => onChange(value === '' ? '' : value)
  return (
    <TextField
      id={'TextareaWidget'}
      multiline={true}
      rows={5}
      onChange={_onChange}
      label={label}
    />
  )
}

export default TextareaWidget
