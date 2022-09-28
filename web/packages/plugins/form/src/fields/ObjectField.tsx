import {
  DmssAPI,
  DmtAPI,
  EntityPickerButton,
  ErrorResponse,
  Loading,
  NewEntityButton,
  UIPluginSelector,
  useBlueprint,
} from '@development-framework/dm-core'
import { AxiosResponse } from 'axios'
import React, { useContext, useState } from 'react'
import { AttributeField } from './AttributeField'
import { Button, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { TObjectFieldProps } from '../types'
import { useRegistryContext } from '../RegistryContext'
import { Controller, useFormContext } from 'react-hook-form'
import { AxiosError } from 'axios'
import { AuthContext } from 'react-oauth2-code-pkce'

const Wrapper = styled.div`
  margin-bottom: 20px;
  margin-top: 20px;
`
const AttributeListWrapper = styled.div`
  margin-top: 30px;
`

const ButtonGroup = styled.div`
  display: flex;
  alignitems: flex-end;
`

//  display: flex;
const ItemWrapper = styled.div``

const AddExternal = (props: any) => {
  const { type, namePath, onAdd } = props

  const handleSelect = (entity: any) => {
    onAdd(entity)
  }

  const handleAdd = (entity: any) => {
    onAdd(entity)
  }

  return (
    <ButtonGroup>
      <EntityPickerButton
        data-testid={`select-${namePath}`}
        onChange={handleSelect}
      />
      <NewEntityButton
        data-testid={`new-entity-${namePath}`}
        setReference={handleAdd}
        type={type}
      />
    </ButtonGroup>
  )
}

const AddObject = (props: any) => {
  const { type, namePath, onAdd, contained, dataSourceId, documentId } = props
  const { setValue } = useFormContext()
  const { token } = useContext(AuthContext)
  const dmtApi = new DmtAPI(token)
  const dmssAPI = new DmssAPI(token)
  const handleAdd = () => {
    const options = {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    }

    dmtApi
      .instantiateEntity({
        basicEntity: { name: namePath as string, type: type as string },
      })
      .then((newEntity: AxiosResponse<any>) => {
        dmssAPI
          .documentUpdate({
            dataSourceId: dataSourceId,
            documentId: contained ? `${documentId}.${namePath}` : namePath,
            data: JSON.stringify(newEntity.data),
            updateUncontained: false,
          })
          .then((response: any) => {
            setValue(namePath, response.data.data, options)
            onAdd()
          })
          .catch((error: AxiosError<ErrorResponse>) => {
            console.error(error)
          })
      })
  }
  return (
    <Button
      variant="outlined"
      data-testid={`add-${namePath}`}
      onClick={handleAdd}
    >
      Add
    </Button>
  )
}

export const OpenObject = (props: any) => {
  const { type, namePath, contained, dataSourceId, documentId, entity } = props
  const { onOpen, setValue } = useRegistryContext()
  const absoluteDottedId = contained
    ? `${dataSourceId}/${documentId}.${namePath}`
    : `${dataSourceId}/${documentId}`
  return (
    <Button
      variant="outlined"
      onClick={() =>
        onOpen({
          attribute: namePath,
          entity: entity || {
            type,
          },
          absoluteDottedId: absoluteDottedId,
          onSubmit: (data: any) => {
            const options = {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            }
            setValue(namePath, data, options)
          },
        })
      }
    >
      Open
    </Button>
  )
}
const RemoveObject = (props: any) => {
  const { namePath, onRemove } = props
  const { setValue } = useFormContext()

  const handleAdd = () => {
    // TODO: Fill with default values using createEntity?
    const values = null
    const options = {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    }
    setValue(namePath, values, options)
    onRemove()
  }
  return (
    <Button
      variant="outlined"
      data-testid={`remove-${namePath}`}
      onClick={handleAdd}
    >
      Remove
    </Button>
  )
}

export const orderAttributes = (attributes: any, order: any) => {
  if (!Array.isArray(order)) {
    return attributes
  }
  if (order == null) {
    return attributes
  }

  const arrayToHash = (arr: any) =>
    arr.reduce((prev: any, curr: any): any => {
      prev[curr] = true
      return prev
    }, {})

  const propertyHash = arrayToHash(attributes)
  const orderFiltered = order.filter(
    (prop) => prop === '*' || propertyHash[prop]
  )
  const orderHash = arrayToHash(orderFiltered)
  const rest = attributes.filter((prop: any) => !orderHash[prop])
  const restIndex = orderFiltered.indexOf('*')
  if (restIndex === -1) {
    if (rest.length) {
      throw new Error(`uiSchema order list does not contain all properties`)
    }
    return orderFiltered
  }
  if (restIndex !== orderFiltered.lastIndexOf('*')) {
    throw new Error('uiSchema order list contains more than one wildcard item')
  }

  const complete = [...orderFiltered]
  complete.splice(restIndex, 1, ...rest)
  return complete
}

const AttributeList = (props: any) => {
  const { namePath, config, blueprint } = props

  const prefix = namePath === '' ? `` : `${namePath}.`

  const attributeNames = blueprint.attributes.map(
    (attribute: any) => attribute.name
  )
  const orderedAttributesNames = orderAttributes(
    attributeNames,
    (config && config.order) || null
  )

  const attributeFields =
    blueprint &&
    orderedAttributesNames.map((attributeName: any) => {
      const attribute = blueprint.attributes.find(
        (attribute: any) => attribute.name == attributeName
      )
      const uiAttribute =
        config &&
        config.attributes.find(
          (uiAttribute: any) => uiAttribute.name === attribute.name
        )
      return (
        <AttributeField
          key={`${prefix}${attribute.name}`}
          namePath={`${prefix}${attribute.name}`}
          attribute={attribute}
          uiAttribute={uiAttribute}
        />
      )
    })

  return <AttributeListWrapper>{attributeFields}</AttributeListWrapper>
}

const External = (props: any) => {
  const { type, namePath, contained = true, dataSourceId, documentId } = props

  const { getValues } = useFormContext()
  const { onOpen } = useRegistryContext()

  const initialValue = getValues(namePath) || {
    type: type,
  }
  const absoluteDottedId = contained
    ? `${dataSourceId}/${documentId}.${namePath}`
    : `${dataSourceId}/${documentId}`

  return (
    <UIPluginSelector
      key={namePath}
      absoluteDottedId={absoluteDottedId}
      type={initialValue.type}
      onOpen={onOpen}
    />
  )
}

export const Contained = (props: any): JSX.Element => {
  const {
    type,
    namePath,
    displayLabel = '',
    optional = false,
    contained = true,
    config,
    uiRecipe,
    blueprint,
  } = props

  const { getValues, setValue } = useFormContext()
  const { documentId, dataSourceId, onOpen } = useRegistryContext()
  const [isDefined, setIsDefined] = useState(
    namePath == ''
      ? getValues() !== undefined
      : getValues(namePath) !== undefined &&
          Object.keys(getValues(namePath)).length > 0
  )
  const hasOpen = onOpen !== undefined
  const isRoot = namePath == ''
  const values = isRoot ? getValues() : getValues(namePath)
  // const hasValues = values !== undefined
  const shouldOpen = hasOpen && !isRoot

  return (
    <Wrapper>
      <ItemWrapper>
        <Typography bold={true}>{displayLabel}</Typography>
        {!isDefined && (
          <AddObject
            dataSourceId={dataSourceId}
            documentId={documentId}
            contained={contained}
            namePath={namePath}
            type={type}
            onAdd={() => setIsDefined(true)}
          />
        )}
        {shouldOpen && isDefined && (
          <OpenObject
            type={type}
            namePath={namePath}
            contained={contained}
            dataSourceId={dataSourceId}
            documentId={documentId}
            entity={values}
          />
        )}
      </ItemWrapper>
      {!shouldOpen && isDefined && (
        <>
          {!isRoot && optional && (
            <RemoveObject
              namePath={namePath}
              type={type}
              onRemove={() => {
                const options = {
                  shouldValidate: false,
                  shouldDirty: true,
                  shouldTouch: true,
                }
                setValue(namePath, null, options)
              }}
            />
          )}
          {uiRecipe && uiRecipe.plugin !== 'form' && (
            <External
              {...props}
              documentId={documentId}
              dataSourceId={dataSourceId}
            />
          )}
          {(isRoot ||
            uiRecipe === null ||
            (uiRecipe && uiRecipe.plugin === 'form')) && (
            <AttributeList
              type={type}
              namePath={namePath}
              config={uiRecipe ? uiRecipe.config : config}
              blueprint={blueprint}
              contained={contained}
              dataSourceId={dataSourceId}
              documentId={documentId}
            />
          )}
        </>
      )}
    </Wrapper>
  )
}

export const NonContained = (props: any): JSX.Element => {
  const {
    type,
    namePath,
    displayLabel = '',
    contained = true,
    config,
    uiRecipe,
  } = props
  const { getValues, control, setValue } = useFormContext()
  const { dataSourceId, onOpen } = useRegistryContext()
  const initialValue = getValues(namePath)

  return (
    <Wrapper>
      <Typography bold={true}>{displayLabel}</Typography>
      <Controller
        name={namePath}
        control={control}
        defaultValue={initialValue}
        render={({
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          field: { ref, onChange, value },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          fieldState: { invalid, error },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          formState,
        }) => {
          if (value && value._id) {
            return (
              <div>
                <ItemWrapper>
                  <Typography>Id: {value._id}</Typography>
                  <RemoveObject
                    namePath={namePath}
                    type={type}
                    onRemove={() => {
                      const options = {
                        shouldValidate: false,
                        shouldDirty: true,
                        shouldTouch: true,
                      }
                      setValue(namePath, null, options)
                    }}
                  />
                  {onOpen && (
                    <OpenObject
                      type={type}
                      namePath={namePath}
                      contained={contained}
                      dataSourceId={dataSourceId}
                      documentId={value._id}
                      entity={value}
                    />
                  )}
                </ItemWrapper>
                {!onOpen && (
                  <External
                    type={type}
                    namePath={namePath}
                    config={uiRecipe ? uiRecipe.config : config}
                    contained={contained}
                    dataSourceId={dataSourceId}
                    documentId={value._id}
                    onOpen={onOpen}
                  />
                )}
              </div>
            )
          } else {
            const handleAdd = (entity: any) => onChange(entity)

            return (
              <AddExternal type={type} namePath={namePath} onAdd={handleAdd} />
            )
          }
        }}
      />
    </Wrapper>
  )
}

export const ObjectField = (props: TObjectFieldProps): JSX.Element => {
  const { type, namePath, uiAttribute } = props
  const { getValues } = useFormContext()
  const { getWidget } = useRegistryContext()

  // Be able to override the object field
  const Widget =
    uiAttribute && uiAttribute.widget
      ? getWidget(namePath, uiAttribute.widget)
      : ObjectTypeSelector

  const values = getValues(namePath)
  // If the attribute type is an object, we need to find the correct type from the values.
  return (
    <Widget
      {...props}
      type={type === 'object' && values ? values.type : type}
    />
  )
}

export const ObjectTypeSelector = (props: TObjectFieldProps): JSX.Element => {
  const {
    type,
    namePath,
    displayLabel = '',
    optional = false,
    contained = true,
    config,
    uiRecipeName,
  } = props

  const [blueprint, isLoading] = useBlueprint(type)

  if (isLoading) return <Loading />
  if (blueprint === undefined) return <div>Could not find the blueprint</div>

  // The root object uses the ui recipe config that is passed into the ui plugin,
  // the nested objects uses ui recipes names that are passed down from parent configs.
  const uiRecipe = uiRecipeName
    ? blueprint.uiRecipes.find(
        (uiRecipe: any) => uiRecipe.name === uiRecipeName
      )
    : null

  const Content = contained ? Contained : NonContained

  return (
    <Content
      type={type}
      namePath={namePath}
      displayLabel={displayLabel}
      optional={optional}
      contained={contained}
      config={config}
      blueprint={blueprint}
      uiRecipe={uiRecipe}
    />
  )
}
