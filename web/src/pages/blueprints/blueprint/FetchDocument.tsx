import React from 'react'
import useFetch from '../../../components/useFetch'
import { DmtApi } from '../../../api/Api'
const api = new DmtApi()

export type DocumentData = {
  template: any
  formData: any
  view?: any
  uiSchema: any
}

export default (props: any) => {
  const {
    state: { selectedDocumentId },
  } = props
  const [loading, data] = useFetch(
    api.documentTemplateUrlGet(selectedDocumentId)
  )
  if (loading) {
    return <div>Loading...</div>
  }
  if (data && Object.keys(data).length > 0) {
    return props.render(data)
  }
  return null
}
