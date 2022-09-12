import { AccessLevel } from '../../services'
import React from 'react'
import styled from 'styled-components'

const StyledSelect = styled.select`
  font-weight: 700;
  width: 80px;
  padding: 3px;
  border-radius: 3px;
  background-color: transparent;
`

const StyledOption = styled.option`
  font-weight: 700;
`

export const ACLSelect = ({
  value,
  handleChange,
}: {
  value: AccessLevel
  handleChange: (newValue: AccessLevel) => void
}): JSX.Element => {
  const accessLevelKeys: string[] = []
  for (const enumMember in AccessLevel) {
    accessLevelKeys.push(enumMember)
  }

  return (
    <div style={{ width: '150px', padding: '10px' }}>
      <StyledSelect
        value={AccessLevel[value]}
        onChange={(event) => {
          if (accessLevelKeys.includes(event.target.value)) {
            // @ts-ignore
            handleChange(AccessLevel[event.target.value])
          }
        }}
      >
        {accessLevelKeys.map((accessLevelKey) => (
          <StyledOption value={accessLevelKey} key={accessLevelKey}>
            {accessLevelKey}
          </StyledOption>
        ))}
      </StyledSelect>
    </div>
  )
}
