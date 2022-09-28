import React, { useContext } from 'react'

import { useFieldArray, useFormContext } from 'react-hook-form'
import { AttributeField } from './AttributeField'
import { Button, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { isPrimitive } from '../utils'
import { useRegistryContext } from '../RegistryContext'
import {
  AuthContext,
  DmssAPI,
  DmtAPI,
  ErrorResponse,
} from '@development-framework/dm-core'
import DynamicTable from '../components/DynamicTable'
import { OpenObject } from './ObjectField'
import { AxiosError } from 'axios'

const Wrapper = styled.div`
  margin-bottom: 20px;
  margin-top: 20px;
  width: 100%;
`

const ItemWrapper = styled.div`
  display: flex;
`

const Stretch = styled.div`
  flex: 1 0 auto;
  margin-right: 10px;
  margin-bottom: 8px;
`

const Sticky = styled.div``

const FixedContainer = styled.div`
  max-height: 400px;
  overflow: auto;
`

const isPrimitiveType = (value: string): boolean => {
  return ['string', 'number', 'integer', 'number', 'boolean'].includes(value)
}

export default function Fields(props: any) {
  const { namePath, displayLabel, type, uiAttribute } = props

  const { documentId, dataSourceId, onOpen } = useRegistryContext()
  const { token } = useContext(AuthContext)
  const dmtApi = new DmtAPI(token)
  const dmssAPI = new DmssAPI(token)
  const { control } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: namePath,
  })

  const handleAddObject = () => {
    const name: string = `${namePath}-${fields.length}`

    dmtApi
      .instantiateEntity({
        basicEntity: { name: name, type: type as string },
      })
      .then((newEntity: any) => {
        dmssAPI
          .documentUpdate({
            dataSourceId: dataSourceId,
            documentId: `${documentId}.${namePath}`,
            data: JSON.stringify([...fields, newEntity]),
            updateUncontained: true,
          })
          .then(() => {
            append(newEntity)
          })
          .catch((error: AxiosError<ErrorResponse>) => {
            console.error(error)
          })
      })
  }

  if (onOpen && !isPrimitiveType(type)) {
    const rows: Array<any> = []
    const columns =
      uiAttribute && uiAttribute.columns
        ? [...uiAttribute.columns, 'actions']
        : ['name', 'actions']
    fields.map((item: any, index: number) => {
      const row: any = {}
      columns.forEach((column: any) => (row[column] = item[column]))

      row['actions'] = (
        <div>
          <OpenObject
            type={type}
            namePath={`${namePath}.${index}`}
            contained={false}
            dataSourceId={dataSourceId}
            documentId={`${documentId}.${namePath}.${index}`}
            entity={item}
          />
          <Button
            variant="outlined"
            type="button"
            onClick={() => remove(index)}
          >
            Remove
          </Button>
        </div>
      )

      rows.push(row)
    })

    return (
      <Wrapper>
        <Typography bold={true}>{displayLabel}</Typography>
        <FixedContainer>
          <DynamicTable columns={columns} rows={rows} />
        </FixedContainer>
        <Button
          variant="outlined"
          data-testid={`add-${namePath}`}
          onClick={() => {
            handleAddObject()
          }}
        >
          Add
        </Button>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <Typography bold={true}>{displayLabel}</Typography>
      <FixedContainer>
        {fields.map((item: any, index: number) => {
          return (
            <ItemWrapper key={item.id}>
              <Stretch>
                <AttributeField
                  namePath={`${namePath}.${index}`}
                  attribute={{
                    attributeType: type,
                    dimensions: '',
                  }}
                />
              </Stretch>
              <Sticky>
                <Button
                  variant="outlined"
                  type="button"
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              </Sticky>
            </ItemWrapper>
          )
        })}
      </FixedContainer>

      <Button
        variant="outlined"
        data-testid={`add-${namePath}`}
        onClick={() => {
          if (isPrimitiveType(type)) {
            const defaultValue = isPrimitive(type) ? ' ' : {}
            append(defaultValue)
          } else {
            handleAddObject()
          }
        }}
      >
        Add
      </Button>
    </Wrapper>
  )
}
