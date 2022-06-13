import * as React from 'react'

import {
  BlueprintPicker,
  DmtPluginType,
  DmtUIPlugin,
  TReference,
  UploadFileButton,
  useBlueprint,
  useDocument,
} from '@dmt/common'
import { Form } from './Form'
import { Button, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { useFormContext } from 'react-hook-form'
import { useRegistryContext } from './RegistryContext'
import TextWidget from './widgets/TextWidget'

// The custom widgets goes under here,
// this may at some point be moved out from the form package.
const ErrorHelperText = styled.div`
  color: #b30d2f;
`

const widgets = {
  TypeWidget: (props: any) => {
    const { label, variant, onChange, value, helperText } = props
    const [blueprint, isLoading] = useBlueprint(value)

    if (isLoading) return <div>Loading...</div>
    if (blueprint === undefined) return <div>Could not find the blueprint</div>

    const datasourceId = value.split('/')[0]

    return (
      <>
        <TextWidget
          label={label}
          readOnly={true}
          value={value}
          onClick={() => {
            // @ts-ignore
            window
              .open(`dmt/view/${datasourceId}/${blueprint.uid}`, '_blank')
              .focus()
          }}
        />
      </>
    )
  },
  BlueprintPickerWidget: (props: any) => {
    const { label, variant, onChange, value, helperText } = props
    return (
      <>
        <Typography>{label}</Typography>
        <BlueprintPicker
          variant={variant}
          onChange={onChange}
          formData={value}
        />
        {variant === 'error' ? (
          <ErrorHelperText>{helperText}</ErrorHelperText>
        ) : (
          <></>
        )}
      </>
    )
  },
  UploadFileWidget: (props: any) => {
    const { namePath, label, variant, onChange, value, helperText } = props
    const { documentId, dataSourceId } = useRegistryContext()
    const { getValues, control, setValue } = useFormContext()
    const initialValue = getValues(namePath)

    function getNewSTaskBody(filename: string): any {
      return {
        type: 'AnalysisPlatformDS/Blueprints/STask',
        name: filename.replace('.', '_'),
        blob: {
          name: filename,
          type: 'system/SIMOS/Blob',
        },
      }
    }

    const handleUploadedFile = (createdRef: TReference) => {
      onChange(createdRef)
    }

    return (
      <div>
        <div>Name: {initialValue.name}</div>
        <div>Uid: {initialValue.uid}</div>
        <UploadFileButton
          formData={''}
          fileSuffix={['stask']}
          dataSourceId={dataSourceId}
          getBody={(filename: string) => getNewSTaskBody(filename)}
          onUpload={handleUploadedFile}
        />
      </div>
    )
  },
}

const PluginComponent = (props: DmtUIPlugin) => {
  const { config, onSubmit, onOpen } = props
  const { documentId, dataSourceId } = props
  const [document, loading, updateDocument] = useDocument<any>(
    dataSourceId,
    documentId,
    999
  )
  if (loading) return <div>Loading...</div>

  const handleOnSubmit = (formData: any) => {
    updateDocument(formData)
  }

  return (
    <Form
      onOpen={onOpen}
      documentId={documentId}
      dataSourceId={dataSourceId}
      widgets={widgets}
      type={document.type}
      config={config}
      formData={document}
      onSubmit={handleOnSubmit}
    />
  )
}

export const plugins: any = [
  {
    pluginName: 'form',
    pluginType: DmtPluginType.UI,
    component: PluginComponent,
  },
]
