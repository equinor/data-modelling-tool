/* tslint:disable */
/* eslint-disable */
/**
 * Data Modelling Storage Service
 * API for basic data modelling interaction
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import {
    AddToParentRequest,
    AddToParentRequestFromJSON,
    AddToParentRequestToJSON,
    DataSourceRequest,
    DataSourceRequestFromJSON,
    DataSourceRequestToJSON,
    EntityName,
    EntityNameFromJSON,
    EntityNameToJSON,
    GetDocumentResponse,
    GetDocumentResponseFromJSON,
    GetDocumentResponseToJSON,
    HTTPValidationError,
    HTTPValidationErrorFromJSON,
    HTTPValidationErrorToJSON,
    MoveRequest,
    MoveRequestFromJSON,
    MoveRequestToJSON,
    RemoveByPathRequest,
    RemoveByPathRequestFromJSON,
    RemoveByPathRequestToJSON,
    RemoveRequest,
    RemoveRequestFromJSON,
    RemoveRequestToJSON,
    RenameRequest,
    RenameRequestFromJSON,
    RenameRequestToJSON,
    SearchDataRequest,
    SearchDataRequestFromJSON,
    SearchDataRequestToJSON,
} from '../models';

export interface BlobGetByIdRequest {
    dataSourceId: string;
    blobId: string;
}

export interface BlueprintGetRequest {
    typeRef: string;
}

export interface DataSourceGetRequest {
    dataSourceId: string;
}

export interface DataSourceSaveRequest {
    dataSourceId: string;
    dataSourceRequest: DataSourceRequest;
}

export interface DocumentGetByIdRequest {
    dataSourceId: string;
    documentId: string;
    uiRecipe?: string;
    attribute?: string;
    depth?: number;
}

export interface DocumentGetByPathRequest {
    dataSourceId: string;
    uiRecipe?: string;
    attribute?: string;
    path?: string;
}

export interface DocumentUpdateRequest {
    dataSourceId: string;
    documentId: string;
    body: object;
    attribute?: string;
}

export interface ExplorerAddDocumentRequest {
    dataSourceId: string;
    body: object;
}

export interface ExplorerAddPackageRequest {
    dataSourceId: string;
    entityName: EntityName;
}

export interface ExplorerAddRawRequest {
    dataSourceId: string;
    body: object;
}

export interface ExplorerAddToParentRequest {
    dataSourceId: string;
    addToParentRequest: AddToParentRequest;
}

export interface ExplorerAddToPathRequest {
    dataSourceId: string;
    document: string;
    directory: string;
    files?: Array<Blob>;
}

export interface ExplorerMoveRequest {
    dataSourceId: string;
    moveRequest: MoveRequest;
}

export interface ExplorerRemoveRequest {
    dataSourceId: string;
    removeRequest: RemoveRequest;
}

export interface ExplorerRemoveByPathRequest {
    dataSourceId: string;
    removeByPathRequest: RemoveByPathRequest;
}

export interface ExplorerRenameRequest {
    dataSourceId: string;
    renameRequest: RenameRequest;
}

export interface PackageFindByNameRequest {
    dataSourceId: string;
    name: string;
}

export interface PackageGetRequest {
    dataSourceId: string;
}

export interface SearchRequest {
    dataSourceId: string;
    searchDataRequest: SearchDataRequest;
}

/**
 * 
 */
export class DefaultApi extends runtime.BaseAPI {

    /**
     * Get By Id
     */
    async blobGetByIdRaw(requestParameters: BlobGetByIdRequest): Promise<runtime.ApiResponse<Blob>> {
        if (requestParameters.dataSourceId === null || requestParameters.dataSourceId === undefined) {
            throw new runtime.RequiredError('dataSourceId','Required parameter requestParameters.dataSourceId was null or undefined when calling blobGetById.');
        }

        if (requestParameters.blobId === null || requestParameters.blobId === undefined) {
            throw new runtime.RequiredError('blobId','Required parameter requestParameters.blobId was null or undefined when calling blobGetById.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/blobs/{data_source_id}/{blob_id}`.replace(`{${"data_source_id"}}`, encodeURIComponent(String(requestParameters.dataSourceId))).replace(`{${"blob_id"}}`, encodeURIComponent(String(requestParameters.blobId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.BlobApiResponse(response);
    }

    /**
     * Get By Id
     */
    async blobGetById(requestParameters: BlobGetByIdRequest): Promise<Blob> {
        const response = await this.blobGetByIdRaw(requestParameters);
        return await response.value();
    }

    /**
     * Fetch the Blueprint of a type (including extended attributes)
     * Get Blueprint
     */
    async blueprintGetRaw(requestParameters: BlueprintGetRequest): Promise<runtime.ApiResponse<object>> {
        if (requestParameters.typeRef === null || requestParameters.typeRef === undefined) {
            throw new runtime.RequiredError('typeRef','Required parameter requestParameters.typeRef was null or undefined when calling blueprintGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/blueprint/{type_ref}`.replace(`{${"type_ref"}}`, encodeURIComponent(String(requestParameters.typeRef))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     * Fetch the Blueprint of a type (including extended attributes)
     * Get Blueprint
     */
    async blueprintGet(requestParameters: BlueprintGetRequest): Promise<object> {
        const response = await this.blueprintGetRaw(requestParameters);
        return await response.value();
    }

    /**
     * Get
     */
    async dataSourceGetRaw(requestParameters: DataSourceGetRequest): Promise<runtime.ApiResponse<any>> {
        if (requestParameters.dataSourceId === null || requestParameters.dataSourceId === undefined) {
            throw new runtime.RequiredError('dataSourceId','Required parameter requestParameters.dataSourceId was null or undefined when calling dataSourceGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/data-sources/{data_source_id}`.replace(`{${"data_source_id"}}`, encodeURIComponent(String(requestParameters.dataSourceId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Get
     */
    async dataSourceGet(requestParameters: DataSourceGetRequest): Promise<any> {
        const response = await this.dataSourceGetRaw(requestParameters);
        return await response.value();
    }

    /**
     * Get All
     */
    async dataSourceGetAllRaw(): Promise<runtime.ApiResponse<any>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/data-sources`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Get All
     */
    async dataSourceGetAll(): Promise<any> {
        const response = await this.dataSourceGetAllRaw();
        return await response.value();
    }

    /**
     * Create or update a data source configuration
     * Save
     */
    async dataSourceSaveRaw(requestParameters: DataSourceSaveRequest): Promise<runtime.ApiResponse<any>> {
        if (requestParameters.dataSourceId === null || requestParameters.dataSourceId === undefined) {
            throw new runtime.RequiredError('dataSourceId','Required parameter requestParameters.dataSourceId was null or undefined when calling dataSourceSave.');
        }

        if (requestParameters.dataSourceRequest === null || requestParameters.dataSourceRequest === undefined) {
            throw new runtime.RequiredError('dataSourceRequest','Required parameter requestParameters.dataSourceRequest was null or undefined when calling dataSourceSave.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/v1/data-sources/{data_source_id}`.replace(`{${"data_source_id"}}`, encodeURIComponent(String(requestParameters.dataSourceId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: DataSourceRequestToJSON(requestParameters.dataSourceRequest),
        });

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Create or update a data source configuration
     * Save
     */
    async dataSourceSave(requestParameters: DataSourceSaveRequest): Promise<any> {
        const response = await this.dataSourceSaveRaw(requestParameters);
        return await response.value();
    }

    /**
     * Get By Id
     */
    async documentGetByIdRaw(requestParameters: DocumentGetByIdRequest): Promise<runtime.ApiResponse<GetDocumentResponse>> {
        if (requestParameters.dataSourceId === null || requestParameters.dataSourceId === undefined) {
            throw new runtime.RequiredError('dataSourceId','Required parameter requestParameters.dataSourceId was null or undefined when calling documentGetById.');
        }

        if (requestParameters.documentId === null || requestParameters.documentId === undefined) {
            throw new runtime.RequiredError('documentId','Required parameter requestParameters.documentId was null or undefined when calling documentGetById.');
        }

        const queryParameters: any = {};

        if (requestParameters.uiRecipe !== undefined) {
            queryParameters['ui_recipe'] = requestParameters.uiRecipe;
        }

        if (requestParameters.attribute !== undefined) {
            queryParameters['attribute'] = requestParameters.attribute;
        }

        if (requestParameters.depth !== undefined) {
            queryParameters['depth'] = requestParameters.depth;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/documents/{data_source_id}/{document_id}`.replace(`{${"data_source_id"}}`, encodeURIComponent(String(requestParameters.dataSourceId))).replace(`{${"document_id"}}`, encodeURIComponent(String(requestParameters.documentId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDocumentResponseFromJSON(jsonValue));
    }

    /**
     * Get By Id
     */
    async documentGetById(requestParameters: DocumentGetByIdRequest): Promise<GetDocumentResponse> {
        const response = await this.documentGetByIdRaw(requestParameters);
        return await response.value();
    }

    /**
     * Get a document by it\'s path in the form \"{dataSource}/{rootPackage}/{subPackage(s)?/{name}
     * Get By Path
     */
    async documentGetByPathRaw(requestParameters: DocumentGetByPathRequest): Promise<runtime.ApiResponse<object>> {
        if (requestParameters.dataSourceId === null || requestParameters.dataSourceId === undefined) {
            throw new runtime.RequiredError('dataSourceId','Required parameter requestParameters.dataSourceId was null or undefined when calling documentGetByPath.');
        }

        const queryParameters: any = {};

        if (requestParameters.uiRecipe !== undefined) {
            queryParameters['ui_recipe'] = requestParameters.uiRecipe;
        }

        if (requestParameters.attribute !== undefined) {
            queryParameters['attribute'] = requestParameters.attribute;
        }

        if (requestParameters.path !== undefined) {
            queryParameters['path'] = requestParameters.path;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/documents-by-path/{data_source_id}`.replace(`{${"data_source_id"}}`, encodeURIComponent(String(requestParameters.dataSourceId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     * Get a document by it\'s path in the form \"{dataSource}/{rootPackage}/{subPackage(s)?/{name}
     * Get By Path
     */
    async documentGetByPath(requestParameters: DocumentGetByPathRequest): Promise<object> {
        const response = await this.documentGetByPathRaw(requestParameters);
        return await response.value();
    }

    /**
     * Update
     */
    async documentUpdateRaw(requestParameters: DocumentUpdateRequest): Promise<runtime.ApiResponse<any>> {
        if (requestParameters.dataSourceId === null || requestParameters.dataSourceId === undefined) {
            throw new runtime.RequiredError('dataSourceId','Required parameter requestParameters.dataSourceId was null or undefined when calling documentUpdate.');
        }

        if (requestParameters.documentId === null || requestParameters.documentId === undefined) {
            throw new runtime.RequiredError('documentId','Required parameter requestParameters.documentId was null or undefined when calling documentUpdate.');
        }

        if (requestParameters.body === null || requestParameters.body === undefined) {
            throw new runtime.RequiredError('body','Required parameter requestParameters.body was null or undefined when calling documentUpdate.');
        }

        const queryParameters: any = {};

        if (requestParameters.attribute !== undefined) {
            queryParameters['attribute'] = requestParameters.attribute;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/v1/documents/{data_source_id}/{document_id}`.replace(`{${"data_source_id"}}`, encodeURIComponent(String(requestParameters.dataSourceId))).replace(`{${"document_id"}}`, encodeURIComponent(String(requestParameters.documentId))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.body as any,
        });

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Update
     */
    async documentUpdate(requestParameters: DocumentUpdateRequest): Promise<any> {
        const response = await this.documentUpdateRaw(requestParameters);
        return await response.value();
    }

    /**
     * Posted document must be a valid Entity (\'name\' and \'type\' required)
     * Add Document
     */
    async explorerAddDocumentRaw(requestParameters: ExplorerAddDocumentRequest): Promise<runtime.ApiResponse<any>> {
        if (requestParameters.dataSourceId === null || requestParameters.dataSourceId === undefined) {
            throw new runtime.RequiredError('dataSourceId','Required parameter requestParameters.dataSourceId was null or undefined when calling explorerAddDocument.');
        }

        if (requestParameters.body === null || requestParameters.body === undefined) {
            throw new runtime.RequiredError('body','Required parameter requestParameters.body was null or undefined when calling explorerAddDocument.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/v1/explorer/{data_source_id}/add-document`.replace(`{${"data_source_id"}}`, encodeURIComponent(String(requestParameters.dataSourceId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.body as any,
        });

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Posted document must be a valid Entity (\'name\' and \'type\' required)
     * Add Document
     */
    async explorerAddDocument(requestParameters: ExplorerAddDocumentRequest): Promise<any> {
        const response = await this.explorerAddDocumentRaw(requestParameters);
        return await response.value();
    }

    /**
     * Add Package
     */
    async explorerAddPackageRaw(requestParameters: ExplorerAddPackageRequest): Promise<runtime.ApiResponse<any>> {
        if (requestParameters.dataSourceId === null || requestParameters.dataSourceId === undefined) {
            throw new runtime.RequiredError('dataSourceId','Required parameter requestParameters.dataSourceId was null or undefined when calling explorerAddPackage.');
        }

        if (requestParameters.entityName === null || requestParameters.entityName === undefined) {
            throw new runtime.RequiredError('entityName','Required parameter requestParameters.entityName was null or undefined when calling explorerAddPackage.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/v1/explorer/{data_source_id}/add-package`.replace(`{${"data_source_id"}}`, encodeURIComponent(String(requestParameters.dataSourceId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: EntityNameToJSON(requestParameters.entityName),
        });

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Add Package
     */
    async explorerAddPackage(requestParameters: ExplorerAddPackageRequest): Promise<any> {
        const response = await this.explorerAddPackageRaw(requestParameters);
        return await response.value();
    }

    /**
     * Posted document must be a valid Entity (\'name\' and \'type\' required)
     * Add Raw
     */
    async explorerAddRawRaw(requestParameters: ExplorerAddRawRequest): Promise<runtime.ApiResponse<any>> {
        if (requestParameters.dataSourceId === null || requestParameters.dataSourceId === undefined) {
            throw new runtime.RequiredError('dataSourceId','Required parameter requestParameters.dataSourceId was null or undefined when calling explorerAddRaw.');
        }

        if (requestParameters.body === null || requestParameters.body === undefined) {
            throw new runtime.RequiredError('body','Required parameter requestParameters.body was null or undefined when calling explorerAddRaw.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/v1/explorer/{data_source_id}/add-raw`.replace(`{${"data_source_id"}}`, encodeURIComponent(String(requestParameters.dataSourceId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.body as any,
        });

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Posted document must be a valid Entity (\'name\' and \'type\' required)
     * Add Raw
     */
    async explorerAddRaw(requestParameters: ExplorerAddRawRequest): Promise<any> {
        const response = await this.explorerAddRawRaw(requestParameters);
        return await response.value();
    }

    /**
     * Add a new document into an existing one. Must match it\'s parents attribute type
     * Add To Parent
     */
    async explorerAddToParentRaw(requestParameters: ExplorerAddToParentRequest): Promise<runtime.ApiResponse<any>> {
        if (requestParameters.dataSourceId === null || requestParameters.dataSourceId === undefined) {
            throw new runtime.RequiredError('dataSourceId','Required parameter requestParameters.dataSourceId was null or undefined when calling explorerAddToParent.');
        }

        if (requestParameters.addToParentRequest === null || requestParameters.addToParentRequest === undefined) {
            throw new runtime.RequiredError('addToParentRequest','Required parameter requestParameters.addToParentRequest was null or undefined when calling explorerAddToParent.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/v1/explorer/{data_source_id}/add-to-parent`.replace(`{${"data_source_id"}}`, encodeURIComponent(String(requestParameters.dataSourceId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AddToParentRequestToJSON(requestParameters.addToParentRequest),
        });

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Add a new document into an existing one. Must match it\'s parents attribute type
     * Add To Parent
     */
    async explorerAddToParent(requestParameters: ExplorerAddToParentRequest): Promise<any> {
        const response = await this.explorerAddToParentRaw(requestParameters);
        return await response.value();
    }

    /**
     * Same as \'add_to_parent\', but reference parent by path instead of ID. Also supports files.
     * Add To Path
     */
    async explorerAddToPathRaw(requestParameters: ExplorerAddToPathRequest): Promise<runtime.ApiResponse<any>> {
        if (requestParameters.dataSourceId === null || requestParameters.dataSourceId === undefined) {
            throw new runtime.RequiredError('dataSourceId','Required parameter requestParameters.dataSourceId was null or undefined when calling explorerAddToPath.');
        }

        if (requestParameters.document === null || requestParameters.document === undefined) {
            throw new runtime.RequiredError('document','Required parameter requestParameters.document was null or undefined when calling explorerAddToPath.');
        }

        if (requestParameters.directory === null || requestParameters.directory === undefined) {
            throw new runtime.RequiredError('directory','Required parameter requestParameters.directory was null or undefined when calling explorerAddToPath.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const consumes: runtime.Consume[] = [
            { contentType: 'multipart/form-data' },
        ];
        // @ts-ignore: canConsumeForm may be unused
        const canConsumeForm = runtime.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): any };
        let useForm = false;
        // use FormData to transmit files using content-type "multipart/form-data"
        useForm = canConsumeForm;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new URLSearchParams();
        }

        if (requestParameters.document !== undefined) {
            formParams.append('document', requestParameters.document as any);
        }

        if (requestParameters.directory !== undefined) {
            formParams.append('directory', requestParameters.directory as any);
        }

        if (requestParameters.files) {
            requestParameters.files.forEach((element) => {
                formParams.append('files', element as any);
            })
        }

        const response = await this.request({
            path: `/api/v1/explorer/{data_source_id}/add-to-path`.replace(`{${"data_source_id"}}`, encodeURIComponent(String(requestParameters.dataSourceId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        });

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Same as \'add_to_parent\', but reference parent by path instead of ID. Also supports files.
     * Add To Path
     */
    async explorerAddToPath(requestParameters: ExplorerAddToPathRequest): Promise<any> {
        const response = await this.explorerAddToPathRaw(requestParameters);
        return await response.value();
    }

    /**
     * Move
     */
    async explorerMoveRaw(requestParameters: ExplorerMoveRequest): Promise<runtime.ApiResponse<any>> {
        if (requestParameters.dataSourceId === null || requestParameters.dataSourceId === undefined) {
            throw new runtime.RequiredError('dataSourceId','Required parameter requestParameters.dataSourceId was null or undefined when calling explorerMove.');
        }

        if (requestParameters.moveRequest === null || requestParameters.moveRequest === undefined) {
            throw new runtime.RequiredError('moveRequest','Required parameter requestParameters.moveRequest was null or undefined when calling explorerMove.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/v1/explorer/{data_source_id}/move`.replace(`{${"data_source_id"}}`, encodeURIComponent(String(requestParameters.dataSourceId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: MoveRequestToJSON(requestParameters.moveRequest),
        });

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Move
     */
    async explorerMove(requestParameters: ExplorerMoveRequest): Promise<any> {
        const response = await this.explorerMoveRaw(requestParameters);
        return await response.value();
    }

    /**
     * Remove
     */
    async explorerRemoveRaw(requestParameters: ExplorerRemoveRequest): Promise<runtime.ApiResponse<any>> {
        if (requestParameters.dataSourceId === null || requestParameters.dataSourceId === undefined) {
            throw new runtime.RequiredError('dataSourceId','Required parameter requestParameters.dataSourceId was null or undefined when calling explorerRemove.');
        }

        if (requestParameters.removeRequest === null || requestParameters.removeRequest === undefined) {
            throw new runtime.RequiredError('removeRequest','Required parameter requestParameters.removeRequest was null or undefined when calling explorerRemove.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/v1/explorer/{data_source_id}/remove`.replace(`{${"data_source_id"}}`, encodeURIComponent(String(requestParameters.dataSourceId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RemoveRequestToJSON(requestParameters.removeRequest),
        });

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Remove
     */
    async explorerRemove(requestParameters: ExplorerRemoveRequest): Promise<any> {
        const response = await this.explorerRemoveRaw(requestParameters);
        return await response.value();
    }

    /**
     * Remove By Path
     */
    async explorerRemoveByPathRaw(requestParameters: ExplorerRemoveByPathRequest): Promise<runtime.ApiResponse<any>> {
        if (requestParameters.dataSourceId === null || requestParameters.dataSourceId === undefined) {
            throw new runtime.RequiredError('dataSourceId','Required parameter requestParameters.dataSourceId was null or undefined when calling explorerRemoveByPath.');
        }

        if (requestParameters.removeByPathRequest === null || requestParameters.removeByPathRequest === undefined) {
            throw new runtime.RequiredError('removeByPathRequest','Required parameter requestParameters.removeByPathRequest was null or undefined when calling explorerRemoveByPath.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/v1/explorer/{data_source_id}/remove-by-path`.replace(`{${"data_source_id"}}`, encodeURIComponent(String(requestParameters.dataSourceId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RemoveByPathRequestToJSON(requestParameters.removeByPathRequest),
        });

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Remove By Path
     */
    async explorerRemoveByPath(requestParameters: ExplorerRemoveByPathRequest): Promise<any> {
        const response = await this.explorerRemoveByPathRaw(requestParameters);
        return await response.value();
    }

    /**
     * Rename
     */
    async explorerRenameRaw(requestParameters: ExplorerRenameRequest): Promise<runtime.ApiResponse<any>> {
        if (requestParameters.dataSourceId === null || requestParameters.dataSourceId === undefined) {
            throw new runtime.RequiredError('dataSourceId','Required parameter requestParameters.dataSourceId was null or undefined when calling explorerRename.');
        }

        if (requestParameters.renameRequest === null || requestParameters.renameRequest === undefined) {
            throw new runtime.RequiredError('renameRequest','Required parameter requestParameters.renameRequest was null or undefined when calling explorerRename.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/v1/explorer/{data_source_id}/rename`.replace(`{${"data_source_id"}}`, encodeURIComponent(String(requestParameters.dataSourceId))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: RenameRequestToJSON(requestParameters.renameRequest),
        });

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Rename
     */
    async explorerRename(requestParameters: ExplorerRenameRequest): Promise<any> {
        const response = await this.explorerRenameRaw(requestParameters);
        return await response.value();
    }

    /**
     * Get a root package by it\'s exact name
     * Find By Name
     */
    async packageFindByNameRaw(requestParameters: PackageFindByNameRequest): Promise<runtime.ApiResponse<any>> {
        if (requestParameters.dataSourceId === null || requestParameters.dataSourceId === undefined) {
            throw new runtime.RequiredError('dataSourceId','Required parameter requestParameters.dataSourceId was null or undefined when calling packageFindByName.');
        }

        if (requestParameters.name === null || requestParameters.name === undefined) {
            throw new runtime.RequiredError('name','Required parameter requestParameters.name was null or undefined when calling packageFindByName.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/packages/{data_source_id}/findByName/{name}`.replace(`{${"data_source_id"}}`, encodeURIComponent(String(requestParameters.dataSourceId))).replace(`{${"name"}}`, encodeURIComponent(String(requestParameters.name))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Get a root package by it\'s exact name
     * Find By Name
     */
    async packageFindByName(requestParameters: PackageFindByNameRequest): Promise<any> {
        const response = await this.packageFindByNameRaw(requestParameters);
        return await response.value();
    }

    /**
     * List all root packages in the requested data source
     * Get
     */
    async packageGetRaw(requestParameters: PackageGetRequest): Promise<runtime.ApiResponse<any>> {
        if (requestParameters.dataSourceId === null || requestParameters.dataSourceId === undefined) {
            throw new runtime.RequiredError('dataSourceId','Required parameter requestParameters.dataSourceId was null or undefined when calling packageGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/packages/{data_source_id}`.replace(`{${"data_source_id"}}`, encodeURIComponent(String(requestParameters.dataSourceId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * List all root packages in the requested data source
     * Get
     */
    async packageGet(requestParameters: PackageGetRequest): Promise<any> {
        const response = await this.packageGetRaw(requestParameters);
        return await response.value();
    }

    /**
     * Search
     */
    async searchRaw(requestParameters: SearchRequest): Promise<runtime.ApiResponse<any>> {
        if (requestParameters.dataSourceId === null || requestParameters.dataSourceId === undefined) {
            throw new runtime.RequiredError('dataSourceId','Required parameter requestParameters.dataSourceId was null or undefined when calling search.');
        }

        if (requestParameters.searchDataRequest === null || requestParameters.searchDataRequest === undefined) {
            throw new runtime.RequiredError('searchDataRequest','Required parameter requestParameters.searchDataRequest was null or undefined when calling search.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/v1/search/{data_source_id}`.replace(`{${"data_source_id"}}`, encodeURIComponent(String(requestParameters.dataSourceId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SearchDataRequestToJSON(requestParameters.searchDataRequest),
        });

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Search
     */
    async search(requestParameters: SearchRequest): Promise<any> {
        const response = await this.searchRaw(requestParameters);
        return await response.value();
    }

}
