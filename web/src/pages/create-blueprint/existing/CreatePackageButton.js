import useToggle from '../../../components/hooks/useToggle'
import React from 'react'
import Modal from '../../../components/modal/Modal'
import useAxios from 'axios-hooks'
import Form from 'react-jsonschema-form'
import { FilesActions } from './TreeViewExistingReducer'
import toJsonSchema from 'to-json-schema'

export const CreatePackageButton = props => {
  const [open, setOpen] = useToggle(false)
  const url = '/api/templates/root-package.json'
  const [{ data, error }] = useAxios(url)
  return (
    <React.Fragment>
      <button type="button" onClick={() => setOpen()}>
        Create Root Package
      </button>

      {open && (
        <Modal open={open} toggle={setOpen}>
          {error && <div>Failed to load jsonschema.</div>}
          {!error && (
            <CreatePackageForm jsonSchema={data} {...props} setOpen={setOpen} />
          )}
        </Modal>
      )}
    </React.Fragment>
  )
}

const CreatePackageForm = ({ jsonSchema, dispatch, setOpen }) => {
  const log = type => console.log.bind(console, type)
  return (
    <Form
      formData={{
        models: [],
        dependencies: [],
        subpackages: [],
        version: '1',
      }}
      schema={jsonSchema}
      onSubmit={({ formData }) => {
        try {
          //validate jsonSchema.
          const jsonSchema = toJsonSchema(formData)
          //todo send formData to api, which adds it to db.
          dispatch(FilesActions.addRootPackage('/' + formData.name))
          setOpen(false)
        } catch (e) {
          //todo fix validation. Set required on fields. And strip optional fields with null values from formdata.
          alert('not valid jsonschema')
        }
      }}
      onChange={log('change')}
      onError={log('errors')}
    />
  )
}
