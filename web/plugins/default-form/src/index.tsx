import * as React from 'react'

import { DmtPluginType, DmtUIPlugin } from '@dmt/core-plugins'
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
} from '@dmt/common'

const PluginComponent = (props: DmtUIPlugin) => {
  const {
    type,
    documentId,
    dataSourceId,
    uiRecipeName,
    explorer,
    onSubmit,
  } = props

  const [document, setDocument] = useState(undefined)
  const [documentType, setDocumentType] = useState(type)
  // @ts-ignore-line
  const { token } = useContext(AuthContext)

  useEffect(() => {
    setDocumentType(type)
  }, [type])

  useEffect(() => {
    if (dataSourceId && documentId) {
      const target = documentId.split('.')
      explorer
        .get({
          dataSourceId,
          documentId: target.shift(),
          attribute: target.join('.'),
        })
        .then((result: any) => {
          setDocument(result.document)
          setDocumentType(result.document.type)
        })
    }
  }, [dataSourceId, documentId])

  const [config, setConfig] = useState(undefined)
  useEffect(() => {
    if (
      (!config && documentType !== undefined) ||
      // @ts-ignore
      (config && config.type !== documentType)
    ) {
      createFormConfigs({
        type: documentType,
        document,
        uiRecipeName,
        explorer,
        token,
      })
        // @ts-ignore
        .then((config: FormConfig) => setConfig(config))
        .catch((error) => {
          throw new Error(
            `error occured when creating config for default-form:  ${error}`
          )
        })
    }
  }, [documentType, config, document, uiRecipeName])

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
          onSubmit(schemas.formData)
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
