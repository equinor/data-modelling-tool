import {
  EntityPickerButton,
  NewEntityButton,
  TReference,
  UIPluginSelector,
  useBlueprint,
} from '@dmt/common'
import React, { useState } from 'react'
import { AttributeField } from './AttributeField'
import { Button, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { ObjectFieldProps } from '../types'
import { useRegistryContext } from '../RegistryContext'
import { asNumber, NumberField } from './NumberField'
import { Controller, useForm, useFormContext } from 'react-hook-form'
import ArrayField from './ArrayField'
import { StringField } from './StringField'
import { BooleanField } from './BooleanField'
// @ts-ignore
import { useTabContext } from '@dmt/tabs'

const Wrapper = styled.div`
  margin-top: 20px;
`

const AttributeListWrapper = styled.div`
  margin-top: 30px;
`

const ButtonGroup = styled.div`
  display: flex;
  alignitems: flex-end;
`

const AddExternal = (props: any) => {
  const { type, namePath, onAdd } = props
  const { setValue } = useFormContext()

  const handleAdd = (entity: any) => {
    console.log(entity)
    // TODO: Fill with default values using createEntity?
    //const values = entity
    //const options = {
    //    shouldValidate: true,
    //    shouldDirty: true,
    //    shouldTouch: true,
    //}
    //setValue(namePath, values, options)
    //onAdd(values._id)
    onAdd(entity)
  }
  return (
    <ButtonGroup>
      <EntityPickerButton
        data-testid={`select-${namePath}`}
        onChange={handleAdd}
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
  const { type, namePath, onAdd } = props
  const { setValue } = useFormContext()

  const handleAdd = () => {
    // TODO: Fill with default values using createEntity?
    const values = {
      type: type,
    }
    const options = {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    }
    setValue(namePath, values, options)
    onAdd()
  }
  return (
    <Button data-testid={`add-${namePath}`} onClick={handleAdd}>
      Add
    </Button>
  )
}

const OpenObject = (props: any) => {
  const { type, namePath, contained, dataSourceId, documentId, entity } = props
  const { onChange } = useTabContext()
  const { onOpen, setValue } = useRegistryContext()
  const absoluteDottedId = contained
    ? `${dataSourceId}/${documentId}.${namePath}`
    : `${dataSourceId}/${documentId}`
  return (
    <Button
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
            onChange()
          },
          // setFormData({...formData, runner: data}),
        })
      }
    >
      Open
    </Button>
  )
}
const RemoveObject = (props: any) => {
  const { type, namePath, onRemove } = props
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
    <Button data-testid={`remove-${namePath}`} onClick={handleAdd}>
      Remove
    </Button>
  )
}

const withOptional = (WrappedComponent: any) => (props: any) => {
  const { type, namePath, contained } = props

  const { getValues, setValue } = useFormContext()
  const initialValue = getValues(namePath) !== undefined
  console.log(getValues(namePath))
  const [isDefined, setIsDefined] = useState(initialValue)
  const [documentId, setDocumentId] = useState(props.documentId)

  if (!isDefined) {
    if (contained) {
      return (
        <AddObject
          namePath={namePath}
          type={type}
          onAdd={() => setIsDefined(true)}
        />
      )
    } else {
      return (
        <AddExternal
          namePath={namePath}
          type={type}
          onAdd={(documentId: string) => {
            setDocumentId(documentId)
            setIsDefined(true)
          }}
        />
      )
    }
  } else {
    return (
      <div>
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
        <WrappedComponent {...props} documentId={documentId} />
      </div>
    )
  }
}

const AttributeList = (props: any) => {
  const { type, namePath, config, blueprint } = props

  const prefix = namePath === '' ? `` : `${namePath}.`
  const attributeFields =
    blueprint &&
    blueprint.attributes.map((attribute: any) => {
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
  const {
    type,
    namePath,
    displayLabel = '',
    optional = false,
    contained = true,
    config,
    uiRecipeName,
    dataSourceId,
    documentId,
    onChange,
  } = props

  const { getValues, control } = useFormContext()

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
      entity={initialValue}
      onChange={onChange}
      //categories={['container', 'edit', 'view']}
      categories={['edit']}
    />
  )
}

export const ObjectField = (props: ObjectFieldProps): JSX.Element => {
  const {
    type,
    namePath,
    displayLabel = '',
    optional = false,
    contained = true,
    config,
    uiRecipeName,
  } = props
  const { watch } = useForm()
  const [blueprint, isLoading, error] = useBlueprint(type)
  const { getValues, control, setValue } = useFormContext()
  const { documentId, dataSourceId, onOpen } = useRegistryContext()
  const initialValue = getValues(namePath)
  // const watchObject = watch(namePath, initialValue);

  if (isLoading) return <div>Loading...</div>
  if (blueprint === undefined) return <div>Could not find the blueprint</div>

  // The root object uses the ui recipe config that is passed into the ui plugin,
  // the nested objects uses ui recipes names that are passed down from parent configs.
  const uiRecipe = uiRecipeName
    ? blueprint.uiRecipes.find(
        (uiRecipe: any) => uiRecipe.name === uiRecipeName
      )
    : null

  if (uiRecipe && uiRecipe.plugin !== 'form') {
    console.log('HERE', namePath)
    return (
      <External
        {...props}
        documentId={documentId}
        dataSourceId={dataSourceId}
      />
    )
  }

  if (contained) {
    console.log('CONTAINED', namePath)
    const Content = optional ? withOptional(AttributeList) : AttributeList
    return (
      <Wrapper>
        <Typography bold={true}>{displayLabel}</Typography>
        <Content
          type={type}
          namePath={namePath}
          config={uiRecipe ? uiRecipe.config : config}
          blueprint={blueprint}
          contained={contained}
          dataSourceId={dataSourceId}
          documentId={documentId}
        />
      </Wrapper>
    )
  } else {
    if (type === 'object') {
      return (
        <Wrapper>
          <Typography bold={true}>{displayLabel}</Typography>
          <Controller
            name={namePath}
            control={control}
            defaultValue={initialValue}
            render={({
              // @ts-ignore
              field: { ref, onChange, value },
              // @ts-ignore
              fieldState: { invalid, error },
              formState,
            }) => {
              if (value) {
                console.log('VALUE', value)
                return (
                  <>
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
                    {!onOpen && (
                      <External
                        type={type}
                        namePath={namePath}
                        config={uiRecipe ? uiRecipe.config : config}
                        blueprint={blueprint}
                        contained={contained}
                        dataSourceId={dataSourceId}
                        //documentId={initialValue && initialValue._id}
                        documentId={value._id}
                      />
                    )}
                  </>
                )
              } else {
                const handleAdd = (entity: any) => onChange(entity)

                return (
                  <AddExternal
                    type={type}
                    namePath={namePath}
                    onAdd={handleAdd}
                  />
                )
              }
            }}
          />
        </Wrapper>
      )
    }
  }

  return <>Unkown object field</>
}
