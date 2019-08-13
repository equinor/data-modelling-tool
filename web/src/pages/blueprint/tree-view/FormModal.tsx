import React from 'react'
import Modal from '../../../components/modal/Modal'
import Form from '../../../components/Form'
import axios from 'axios'
import { FilesActions } from './BluePrintTreeViewReducer'

type FormModalProps = {
  action: string
  path: string
  open: boolean
  setOpen: (open: boolean) => void
  dispatch: (action: {}) => void
}

export default (props: FormModalProps) => {
  const { setOpen, open, dispatch, action, path } = props
  const formConfig = getConfigByAction({ action, dispatch, setOpen, path })
  return (
    <Modal toggle={() => setOpen(!open)} open={open}>
      <Form {...formConfig}></Form>
    </Modal>
  )
}

interface GetActionConfigType extends ActionConfigType {
  action: string
}

function getConfigByAction(props: GetActionConfigType) {
  switch (props.action) {
    case 'add-package':
      return addPackageConfig(props)
    case 'add-subpackage':
      return addSubPackageConfig(props)
    case 'edit-package':
      return editPackageConfig(props)
    case 'edit-subpackage':
      return editSubPackageConfig(props)
    case 'clear':
      //avoid logging.
      break
    default:
      console.warn(props.action + ' is not supported.')
  }
  return {
    onSubmit: (action: {}) => {},
    schemaUrl: '',
    dataUrl: '',
  }
}

interface ActionConfigType {
  dispatch: (action: {}) => void
  path: string
  setOpen: (open: boolean) => void
}

function addPackageConfig(props: ActionConfigType) {
  const { dispatch, setOpen } = props
  return {
    schemaUrl: '/api/templates/package.json',
    dataUrl: '',
    onSubmit: (formData: any) => {
      console.log(formData)
      axios
        .put(
          `/api/blueprints/${formData.title}/${formData.version}/package.json`,
          formData
        )
        .then(res => {
          dispatch(FilesActions.addRootPackage(res.data))
          setOpen(false)
        })
        .catch(err => {
          console.log(err)
        })
    },
  }
}

function editPackageConfig(props: ActionConfigType) {
  const { setOpen, path } = props
  const dataUrl = '/api/blueprints/' + path
  return {
    schemaUrl: '/api/templates/package.json',
    dataUrl,
    onSubmit: (formData: any) => {
      axios
        .put(dataUrl, formData)
        .then(res => {
          // @todo use notification.
          // @todo editing title or version is not updating the tree.
          console.log(res.data + ' is updated.')
          setOpen(false)
        })
        .catch(err => {
          console.error(err)
        })
    },
  }
}

function addSubPackageConfig(props: ActionConfigType) {
  const { dispatch, setOpen, path } = props
  return {
    schemaUrl: '/api/templates/subpackage.json',
    dataUrl: '',
    onSubmit: (formData: any) => {
      const url = `/api/blueprints/${path.replace(
        'package.json',
        formData.title + '/package.json'
      )}`
      axios
        .put(url, formData)
        .then(res => {
          setOpen(false)
          dispatch(FilesActions.addPackage(res.data, formData.title))
        })
        .catch(err => {
          console.log(err)
        })
    },
  }
}

function editSubPackageConfig(props: ActionConfigType) {
  const { setOpen, path } = props
  const dataUrl = '/api/blueprints/' + path
  return {
    schemaUrl: '/api/templates/subpackage.json',
    dataUrl,
    onSubmit: (formData: any) => {
      axios
        .put(dataUrl, formData)
        .then(res => {
          setOpen(false)
        })
        .catch(err => {
          console.error(err)
        })
    },
  }
}
