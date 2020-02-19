import React from 'react'
import Form from 'react-jsonschema-form'
import { BlueprintType, KeyValue, PluginProps } from '../../domain/types'
import { createFormConfigs, FormConfig } from './CreateConfig'
import { AttributeWidget } from '../form-rjsf-widgets/Attribute'
import { Blueprint } from '../../domain/Blueprint'
import { BlueprintProvider } from '../BlueprintProvider'
import FileDirectoryWidget from '../form-rjsf-widgets/FileDirectoryWidget'
import DestinationSelectorWidget from '../form-rjsf-widgets/DestinationSelectorWidget'
import { CollapsibleField } from '../widgets/CollapsibleField'
import {
  PackagesSelector,
  BlueprintsSelector,
} from '../form-rjsf-widgets/MultiSelectorWidget'
import BlueprintSelectorWidget from '../form-rjsf-widgets/BlueprintSelectorWidget'
import { ReadOnlyWidget } from '../form-rjsf-widgets/ReadOnly'

export interface EditPluginProps extends PluginProps {
  onSubmit: (data: any) => void
  rootDocument: BlueprintType | undefined
}

export const EditPlugin = (props: EditPluginProps) => {
  const blueprintProvider = new BlueprintProvider(
    props.blueprintTypes,
    props.dtos
  )
  const blueprint = new Blueprint(props.blueprintType)
  const config: FormConfig = createFormConfigs(props)
  const formData = config.data
  return (
    <div style={{ marginBottom: 20 }}>
      <Form
        validate={validate(blueprint)}
        schema={config.template}
        formData={formData || {}}
        uiSchema={config.uiSchema || {}}
        fields={{
          attribute: AttributeWidget,
          collapsible: CollapsibleField,
          destination: DestinationSelectorWidget,
          blueprint: BlueprintSelectorWidget,
          blueprints: BlueprintsSelector,
          packages: PackagesSelector,
          matrix: ReadOnlyWidget,
          hidden: () => <div />,
        }}
        widgets={{
          fileUploadWidget: FileDirectoryWidget,
        }}
        // onChange={schema => {
        //   console.log(schema)
        // }}
        onSubmit={(schemas: any) => {
          fixRecursive(schemas.formData, blueprintProvider)
          props.onSubmit(schemas)
        }}
      />
    </div>
  )
}

function fixRecursive(
  entity: KeyValue,
  blueprintProvider: BlueprintProvider
): void {
  const blueprintType:
    | BlueprintType
    | undefined = blueprintProvider.getBlueprintByType(entity.type)
  if (blueprintType) {
    const blueprint: Blueprint | undefined = new Blueprint(blueprintType)
    blueprint.validateEntity(entity)
    Object.keys(entity).forEach((key: string) => {
      const attr = blueprint.getAttribute(key)
      if (attr) {
        if (blueprint.isArray(attr)) {
          entity[attr.name].forEach((entityItem: KeyValue, index: number) => {
            blueprint.validateEntity(entityItem)
            fixRecursive(entityItem, blueprintProvider)
          })
        }
      }
    })
  }
}

/**
 * Fundamental client side validation.
 * Ensure only valid entities are posted.
 *
 * @todo set defaults in formData passed to form.
 * @param blueprint
 */
function validate(blueprint: Blueprint) {
  return (formData: KeyValue, errors: any) => {
    Object.keys(formData).forEach((key: string) => {
      const attr = blueprint.getBlueprintAttribute(key)

      if (attr) {
        if (attr.isArray() && !attr.isPrimitive()) {
          const arr: any[] = formData[key]
          arr.forEach((item: any, index: number) => {
            if (!item.name) {
              errors[key][index].addError('name must be set')
            }
            if (!item.type || item.type === 'blueprint') {
              errors[key][index].addError('type must be set')
            }
          })
        }
      }
    })
    return errors
  }
}
