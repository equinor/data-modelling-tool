import axios from 'axios'
import { DocumentData } from '../pages/blueprints/blueprint/FetchDocument'

type OnSuccess = (data: DocumentData) => void
type OnError = (err: any) => void

type DocumentFetch = {
  onSuccess: OnSuccess
  onError?: OnError
  documentId: string
}

export default class Api2 {

  fetchDocument({ documentId, onSuccess, onError }: DocumentFetch) {
    const url = `/api/document-template/${documentId}`
    axios
      .get(url)
      .then((res: any) => {
        onSuccess(res.data)
      })
      .catch(onError)
  }
}
