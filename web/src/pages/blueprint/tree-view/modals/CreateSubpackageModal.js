import Modal from '../../../../components/modal/Modal'
import Form from '../../../../components/Form'
import axios from 'axios'
import React from 'react'

const CreateSubPackageModal = props => {
  const { setEditMode, open, path, setOpen, callback } = props
  return (
    <Modal toggle={() => setOpen(!open)} open={open}>
      {path && (
        <Form
          schemaUrl="/api/templates/subpackage.json"
          onSubmit={formData => {
            const parent = path.replace('/package.json', '')
            axios
              .put(
                `/api/blueprints/${parent}/${formData.title}/package.json`,
                formData
              )
              .then(res => {
                setOpen(false)
                setEditMode(false)
                callback(res.data, formData.title)
              })
              .catch(err => {
                console.log(err)
              })
          }}
        ></Form>
      )}
    </Modal>
  )
}

export default CreateSubPackageModal
