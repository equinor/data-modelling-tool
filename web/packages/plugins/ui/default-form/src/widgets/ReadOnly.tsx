import * as React from 'react'
import { RequiredGroup } from '../components/DisabledData'

export const ReadOnlyWidget = (props: any) => {
  const name = props.name
  const data = JSON.stringify(props.formData)
  return (
    <>
      <b>{name}</b>
      <RequiredGroup>{data}</RequiredGroup>
    </>
  )
}
