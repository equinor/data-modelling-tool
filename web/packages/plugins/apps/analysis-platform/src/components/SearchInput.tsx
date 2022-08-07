import React from 'react'
import { Label, Search } from '@equinor/eds-core-react'

const SearchInput = (props: {
  placeholder?: string
  onChange: () => void
}): JSX.Element => {
  const { placeholder, onChange } = props
  return (
    <>
      <div>
        <Label label="Search by operation name" />
        <Search
          aria-label="operations"
          id="search-operations"
          placeholder={placeholder || 'Search'}
          onChange={onChange}
        />
      </div>
    </>
  )
}

export default SearchInput
