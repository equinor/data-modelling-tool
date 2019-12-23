import React, { useEffect, useState } from 'react'
import { DefaultEditForm } from '../plugins'

export interface FormProps {
  fetchDocument?: any
  onSubmit: (formData: any) => void
  selectedUiSchema?: string
}

export default ({ onSubmit, fetchDocument }: FormProps) => {
  const [loading, setLoading] = useState<boolean | null>(null)
  const [documentData, setDocumentData] = useState({
    document: {},
    template: {},
  })

  useEffect(() => {
    if (fetchDocument) {
      setLoading(true)
      fetchDocument({
        onSuccess: (documentData: any) => {
          setDocumentData(documentData)
          setLoading(false)
        },
        onError: (err: any) => setLoading(false),
      })
    }
  }, [fetchDocument])

  //avoid first render.
  if (loading === null) {
    return null
  }
  if (loading) {
    return <div>Loading...</div>
  }

  const document = documentData.hasOwnProperty('document')
    ? // @ts-ignore
      documentData.document || {}
    : {}
  // @ts-ignore
  return (
    <DefaultEditForm
      document={document}
      blueprints={[]}
      blueprintType={{
        name: '',
        description: '',
        type: '',
        attributes: [],
        uiRecipes: [],
        storageRecipes: [],
      }}
      template={documentData.template}
      // @ts-ignore
      onSubmit={schemas => {
        const formData: any = schemas.formData
        try {
          onSubmit(formData)
        } catch (e) {
          //todo fix validation. Set required on fields. And strip optional fields with null values from formdata.
          console.error(e)
        }
      }}
    />
  )
}
