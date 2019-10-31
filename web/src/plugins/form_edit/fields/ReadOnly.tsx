import React from 'react'

export const ReadOnly = (props: any) => {
  return (
    <div>
      <label className="control-label">{props.name}</label>
      <div>{props.formData}</div>
    </div>
  )
}
