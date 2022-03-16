import { useBlueprint } from '@dmt/common'
import React from 'react'
import { AttributeField } from './AttributeField'
import { Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { ObjectFieldProps } from '../types'

const Wrapper = styled.div`
  margin-top: 20px;
`

const AttributeListWrapper = styled.div`
  margin-top: 30px;
`

export const ObjectField = (props: ObjectFieldProps) => {
  const { namePath, type, formData } = props

  // TODO: How to handle object type?
  if (type === 'object') return <></>

  const [blueprint, isLoadingBlueprint, error] = useBlueprint(type)

  if (isLoadingBlueprint) return <div>Loading...</div>
  if (blueprint === undefined) return <div>Could not find blueprint</div>

  const prefix = namePath === '' ? `` : `${namePath}.`

  const attributeFields = blueprint.attributes.map((attribute: any) => {
    const data =
      formData && attribute.name in formData ? formData[attribute.name] : ''
    return (
      <AttributeField
        key={`${prefix}${attribute.name}`}
        namePath={`${prefix}${attribute.name}`}
        attribute={attribute}
        formData={data}
      />
    )
  })

  return (
    <Wrapper>
      <Typography>{blueprint.name}</Typography>
      <AttributeListWrapper>{attributeFields}</AttributeListWrapper>
    </Wrapper>
  )
}
