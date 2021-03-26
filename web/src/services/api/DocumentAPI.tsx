import { IDocumentAPI } from './interfaces/DocumentAPI'
import apiProvider from './utilities/Provider'
import { documentAPI } from '../../api/StorageServiceAPI'

export class DocumentAPI implements IDocumentAPI {
  create(url: string, data: any): Promise<any> {
    /**
     *  TODO: Move create logic away from API and here like:
     *  root package: /add-package
     *  normal documents: /add-to-parent
     */
    return apiProvider.post(url, data)
  }

  getByPath(dataSourceId: string, path: string): Promise<any> {
    return documentAPI.getByPath({ dataSourceId, path })
  }

  remove(url: string, data: any): Promise<any> {
    return apiProvider.post(url, data)
  }

  update(url: string, data: any): Promise<any> {
    /**
     * TODO: Move update logic away from API and here like:
     *
     * Can we build this url from client? /api/v2/documents/{data_source_id}/{document_split[0]}{attribute_arg}
     */
    return apiProvider.put(url, data)
  }
}

export default DocumentAPI
