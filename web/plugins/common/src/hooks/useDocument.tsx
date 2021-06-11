import {useEffect, useState} from 'react'
import {DocumentAPI} from "../services/api/DocumentAPI";

export const useDocument = (dataSourceId: string, documentId: string, attribute: string) => {
    const [document, setDocument] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const documentAPI = new DocumentAPI()

    useEffect(() => {
        setLoading(true)
        documentAPI
            .getById(dataSourceId, documentId, attribute)
            .then((document) => {
                console.log(document)
                setDocument(document.document)
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
                setHasError(true)
            })
    }, [dataSourceId, documentId, attribute])
    return [document, isLoading, setDocument, hasError]
}