import React from 'react'

type SearchTreeProps = {
  value: string
  onChange: (value: string) => {}
}

export default (props: SearchTreeProps) => {
  const { onChange } = props
  return (
    <input
      placeholder="Search"
      onKeyUp={(e: any) => {
        onChange(e.target.value.trim())
      }}
    />
  )
}
