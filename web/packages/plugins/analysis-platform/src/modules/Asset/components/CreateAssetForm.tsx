import React, { useState } from 'react'
import { Button, TextField } from '@equinor/eds-core-react'
import { INPUT_FIELD_WIDTH, TLocation } from '@dmt/common'
import { TAsset } from '../../../Types'
import { EBlueprints } from '../../../Enums'
import { FormWrapper } from '../../../components/Design/Styled'

type Errors = {
  [key: string]: any
}

type CreateFormProps = {
  data?: any
  onSubmit: (asset: TAsset) => void
}

const hasErrors = (error: Errors) =>
  error['name'] !== '' || error['description'] !== ''

export const CreateAssetForm = (props: CreateFormProps) => {
  const { onSubmit, data } = props
  const [error, setError] = useState<Errors>({
    name: '',
    description: '',
  })
  const [location, setLocation] = useState<TLocation>({
    _id: '',
    name: data?.location?.name || '',
    type: EBlueprints.LOCATION,
    lat: data?.location?.lat || 0.0,
    long: data?.location?.long || 0.0,
    label: data?.label || '',
  })
  const [asset, setAsset] = useState<TAsset>({
    _id: '',
    type: EBlueprints.ASSET,
    name: data?.name || '',
    description: data?.description || '',
    analyses: [],
    location: location,
    label: '',
    created: '',
    updated: '',
    creator: '',
  })

  const formHandler = (event: any) => {
    event.preventDefault()

    const formErrors: Errors = {
      name: '',
      description: '',
    }

    const singleWordFormat = new RegExp('^[A-Za-z0-9-_]+$')
    if (!singleWordFormat.test(asset.name)) {
      formErrors['name'] =
        'Invalid asset name! (you cannot have empty name or use any special characters).'
    }

    if (!hasErrors(formErrors)) {
      onSubmit(asset)
    } else {
      setError(formErrors)
    }
  }

  return (
    <form onSubmit={formHandler}>
      <FormWrapper>
        <TextField
          style={{ width: INPUT_FIELD_WIDTH }}
          id="name"
          label="Name"
          placeholder="Asset name"
          onChange={(event: any) =>
            setAsset({ ...asset, name: event.target.value })
          }
          helperText={error.name ? error.name : 'Provide the name of the asset'}
          variant={error.name ? 'error' : 'default'}
          value={asset.name}
        />
        <TextField
          style={{ width: INPUT_FIELD_WIDTH }}
          id="description"
          label="Description"
          placeholder="Description"
          onChange={(event: any) =>
            setAsset({ ...asset, description: event.target.value })
          }
          multiline
          rows={1}
          rowsMax={5}
          helperText={
            error.description
              ? error.description
              : 'Short description about the asset'
          }
          variant={error.description ? 'error' : 'default'}
          value={asset.description}
        />
        <TextField
          style={{ width: INPUT_FIELD_WIDTH }}
          id="contact"
          label="Contact"
          placeholder="Asset contact"
          onChange={(event: any) =>
            setAsset({ ...asset, contact: event.target.value })
          }
          helperText={
            error.contact
              ? error.contact
              : 'Provide the name of the asset point of contact'
          }
          variant={error.contact ? 'error' : 'default'}
          value={asset.contact}
          required={false}
        />
        <div>
          <Button
            type="submit"
            style={{ marginTop: '14px' }}
            onSubmit={formHandler}
          >
            Create
          </Button>
        </div>
      </FormWrapper>
    </form>
  )
}
