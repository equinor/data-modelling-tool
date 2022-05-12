import * as React from 'react'

import {
  BlueprintPicker,
  DmtPluginType,
  DmtUIPlugin,
  useDocument,
} from '@dmt/common'
import { Form } from './Form'
import { Button, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { useFormContext } from 'react-hook-form'
import { useRegistryContext } from './RegistryContext'

// The custom widgets goes under here,
// this may at some point be moved out from the form package.
const ErrorHelperText = styled.div`
  color: #b30d2f;
`

const widgets = {
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
}

const PluginComponent = (props: DmtUIPlugin) => {
  const { config, onSubmit, onChange, onOpen } = props
  const { documentId, dataSourceId } = props
  const [document, loading, updateDocument] = useDocument<any>(
    dataSourceId,
    documentId,
    true
  )
  if (loading) return <div>Loading...</div>

  console.log(documentId, dataSourceId, document)

  return (
    <Form
      onOpen={onOpen}
      documentId={documentId}
      dataSourceId={dataSourceId}
      widgets={widgets}
      type={document.type}
      config={config}
      formData={document}
      onChange={onChange}
      onSubmit={onSubmit}
      updateDocument={updateDocument}
    />
  )
}

export const plugins: any = [
  {
    pluginName: 'form',
    pluginType: DmtPluginType.UI,
    content: {
      component: PluginComponent,
    },
  },
]
