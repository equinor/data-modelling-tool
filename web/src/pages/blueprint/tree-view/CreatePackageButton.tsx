import React, { useEffect, useState } from 'react'
import Modal from '../../../components/modal/Modal'
//@ts-ignore
import Form from 'react-jsonschema-form'
import { FilesActions } from './BluePrintTreeViewReducer'
//@ts-ignore
import toJsonSchema from 'to-json-schema'
import axios from 'axios'

export default (props: any) => {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState()
  const url = '/api/templates/root-package.json'
  const error = null //@todo
  useEffect(() => {
    async function fetch() {
      const response = await axios(url)
      setData(response.data)
    }
    fetch()
  }, [url]) // empty array
  return (
    <React.Fragment>
      <button type="button" onClick={() => setOpen(true)}>
        Create Package
      </button>

      {open && (
        <Modal open={open} toggle={() => setOpen(!open)}>
          {error && <div>Failed to load jsonschema.</div>}
          {!error && (
            //@ts-ignore
            <CreateRootPackageForm
              jsonSchema={data}
              {...props}
              setOpen={setOpen}
            />
          )}
        </Modal>
      )}
    </React.Fragment>
  )
}

type CreatePackageFormProps = {
  jsonSchema: any
  dispatch: any
  setOpen: any
}

const CreateRootPackageForm = (props: CreatePackageFormProps) => {
  const { jsonSchema, dispatch, setOpen } = props
  const log = (type: any) => console.log.bind(console, type)
  return (
    <Form
      formData={{
        models: [],
        dependencies: [],
        subpackages: [],
        version: '1',
      }}
      schema={jsonSchema}
      onSubmit={form => {
        const formData: any = form.formData
        try {
          //validate jsonSchema.d
          toJsonSchema(formData)
          const url = `api/entities-root-packages/${formData.name}/${formData.name}.json`
          axios({
            method: 'put',
            url,
            data: formData,
            responseType: 'json',
          })
            .then(function(response) {
              dispatch(FilesActions.addRootPackage('/' + formData.name))
              setOpen(false)
            })
            .catch(e => {
              console.error(e)
              // @todo use react-alert from npm.
              alert('failed to save root package.')
            })
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
