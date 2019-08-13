import Modal from '../../../../components/modal/Modal'
import Form from '../../../../components/Form'
import axios from 'axios'
// @ts-ignore
import { BlueprintTreeViewActions } from '../BlueprintTreeViewReducer'
import React from 'react'

const CreatePackageModal = props => {
  const { setEditMode, open, setOpen, dispatch } = props
  return (
    <Modal toggle={() => setOpen(!open)} open={open}>
      <Form
        schemaUrl="/api/templates/package.json"
        onSubmit={formData => {
          axios
            .put(
              `/api/blueprints/${formData.title}/${formData.version}/package.json`,
              formData
            )
            .then(res => {
              dispatch(BlueprintTreeViewActions.addRootPackage(res.data))
            })
            .catch(err => {
              console.log(err)
            })
          setOpen(false)
          setEditMode(false)
        }}
      ></Form>
    </Modal>
  )
}

export default CreatePackageModal
