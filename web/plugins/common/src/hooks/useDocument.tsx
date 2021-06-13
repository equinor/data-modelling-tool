import {useEffect, useState} from 'react'
import {DocumentAPI} from "../services/api/DocumentAPI";

export const useDocument = (dataSourceId: string, documentId: string) => {
    const [document, setDocument] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const documentAPI = new DocumentAPI()

    useEffect(() => {
        setLoading(true)
        const target = documentId.split('.')
        const id = `${target.shift()}`
        const attribute = target.join('.')
        documentAPI
            .getById(dataSourceId, id, attribute)
            .then((document) => {
                console.log(document)
                setDocument(document.document)
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
                setHasError(true)
            })
    }, [dataSourceId, documentId])
    return [document, isLoading, setDocument, hasError]
}