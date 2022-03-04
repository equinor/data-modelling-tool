import * as React from 'react'

import { DmtPluginType, DmtUIPlugin } from '@dmt/common'
import { useEffect, useState, useContext } from 'react'
import { Blueprint } from './domain/Blueprint'
import { createFormConfigs, FormConfig } from './CreateConfig'
import Form from 'react-jsonschema-form'
import { AttributeWidget } from './widgets/Attribute'
import { ReadOnlyWidget } from './widgets/ReadOnly'
import FileDirectoryWidget from './widgets/FileDirectoryWidget'
import { CollapsibleField } from './components/CollapsibleField'
import { KeyValue } from './domain/types'
import {
  BlueprintsPicker,
  PackagesPicker,
  BlueprintPicker,
  DestinationPicker,
  AuthContext,
  DmssAPI,
} from '@dmt/common'

function useExplorer(dmssAPI: DmssAPI) {
  const getBlueprint = (typeRef: string) => dmssAPI.getBlueprint({ typeRef })
  return {
    getBlueprint,
  }
}

const PluginComponent = (props: DmtUIPlugin) => {
  const { document, uiRecipeName, onSubmit } = props
  const [config, setConfig] = useState(undefined)
  const [error, setError] = useState<string | null>(null)
  // @ts-ignore-line
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)
  const explorer = useExplorer(dmssAPI)

  useEffect(() => {
    createFormConfigs({
      document,
      uiRecipeName,
      explorer,
      token,
    })
      // @ts-ignore
      .then((config: FormConfig) => setConfig(config))
      .catch((error) => {
        setError(error.message)
        console.log(error.stack)
        throw `error occured when creating config for default-form:  ${error}`
      })
  }, [])

  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>
  if (!config) return <div>Getting config...</div>

  // @ts-ignore
  const blueprint = new Blueprint(config.blueprint)

  return (
    <div style={{ marginBottom: 20 }}>
      <Form
        validate={validate(blueprint)}
        // @ts-ignore
        schema={config.schema}
        // @ts-ignore
        formData={document || {}}
        // @ts-ignore
        uiSchema={config.uiSchema || {}}
        fields={{
          attribute: AttributeWidget,
          collapsible: CollapsibleField,
          destination: DestinationPicker,
          blueprint: BlueprintPicker,
          blueprints: BlueprintsPicker,
          packages: PackagesPicker,
          matrix: ReadOnlyWidget,
          hidden: () => <div />,
        }}
        widgets={{
          fileUploadWidget: FileDirectoryWidget,
        }}
        onSubmit={(schemas: any) => {
          if (onSubmit) onSubmit(schemas.formData)
        }}
      />
    </div>
  )
}

/**
 * Fundamental client side validation.
 * Ensure only valid entities are posted. s
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
          if (arr) {
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
      }
    })
    return errors
  }
}

export const plugins: any = [
  {
    pluginName: 'default-form',
    pluginType: DmtPluginType.UI,
    content: {
      component: PluginComponent,
    },
  },
]
