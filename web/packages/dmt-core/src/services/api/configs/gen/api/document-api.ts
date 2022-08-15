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


import globalAxios, { AxiosPromise, AxiosInstance } from 'axios';
import { Configuration } from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
// @ts-ignore
import { HTTPValidationError } from '../models';
/**
 * DocumentApi - axios parameter creator
 * @export
 */
export const DocumentApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Get By Id
         * @param {string} documentId 
         * @param {string} dataSourceId 
         * @param {string} [attribute] 
         * @param {number} [depth] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        documentGetById: async (documentId: string, dataSourceId: string, attribute?: string, depth?: number, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'documentId' is not null or undefined
            assertParamExists('documentGetById', 'documentId', documentId)
            // verify required parameter 'dataSourceId' is not null or undefined
            assertParamExists('documentGetById', 'dataSourceId', dataSourceId)
            const localVarPath = `/api/v1/documents/{data_source_id}/{document_id}`
                .replace(`{${"document_id"}}`, encodeURIComponent(String(documentId)))
                .replace(`{${"data_source_id"}}`, encodeURIComponent(String(dataSourceId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication APIKeyHeader required
            await setApiKeyToObject(localVarHeaderParameter, "Access-Key", configuration)

            // authentication OAuth2AuthorizationCodeBearer required
            // oauth required
            await setOAuthToObject(localVarHeaderParameter, "OAuth2AuthorizationCodeBearer", [], configuration)

            if (attribute !== undefined) {
                localVarQueryParameter['attribute'] = attribute;
            }

            if (depth !== undefined) {
                localVarQueryParameter['depth'] = depth;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Get a document by it\'s path in the form \"{dataSource}/{rootPackage}/{subPackage(s)?/{name}
         * @summary Get By Path
         * @param {string} dataSourceId 
         * @param {string} [attribute] 
         * @param {string} [path] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        documentGetByPath: async (dataSourceId: string, attribute?: string, path?: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'dataSourceId' is not null or undefined
            assertParamExists('documentGetByPath', 'dataSourceId', dataSourceId)
            const localVarPath = `/api/v1/documents-by-path/{data_source_id}`
                .replace(`{${"data_source_id"}}`, encodeURIComponent(String(dataSourceId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication APIKeyHeader required
            await setApiKeyToObject(localVarHeaderParameter, "Access-Key", configuration)

            // authentication OAuth2AuthorizationCodeBearer required
            // oauth required
            await setOAuthToObject(localVarHeaderParameter, "OAuth2AuthorizationCodeBearer", [], configuration)

            if (attribute !== undefined) {
                localVarQueryParameter['attribute'] = attribute;
            }

            if (path !== undefined) {
                localVarQueryParameter['path'] = path;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Update
         * @param {string} documentId 
         * @param {string} dataSourceId 
         * @param {string} data 
         * @param {boolean} [updateUncontained] 
         * @param {string} [attribute] 
         * @param {Array<any>} [files] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        documentUpdate: async (documentId: string, dataSourceId: string, data: string, updateUncontained?: boolean, attribute?: string, files?: Array<any>, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'documentId' is not null or undefined
            assertParamExists('documentUpdate', 'documentId', documentId)
            // verify required parameter 'dataSourceId' is not null or undefined
            assertParamExists('documentUpdate', 'dataSourceId', dataSourceId)
            // verify required parameter 'data' is not null or undefined
            assertParamExists('documentUpdate', 'data', data)
            const localVarPath = `/api/v1/documents/{data_source_id}/{document_id}`
                .replace(`{${"document_id"}}`, encodeURIComponent(String(documentId)))
                .replace(`{${"data_source_id"}}`, encodeURIComponent(String(dataSourceId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;
            const localVarFormParams = new ((configuration && configuration.formDataCtor) || FormData)();

            // authentication APIKeyHeader required
            await setApiKeyToObject(localVarHeaderParameter, "Access-Key", configuration)

            // authentication OAuth2AuthorizationCodeBearer required
            // oauth required
            await setOAuthToObject(localVarHeaderParameter, "OAuth2AuthorizationCodeBearer", [], configuration)

            if (updateUncontained !== undefined) {
                localVarQueryParameter['update_uncontained'] = updateUncontained;
            }


            if (data !== undefined) { 
                localVarFormParams.append('data', data as any);
            }
    
            if (attribute !== undefined) { 
                localVarFormParams.append('attribute', attribute as any);
            }
                if (files) {
                files.forEach((element) => {
                    localVarFormParams.append('files', element as any);
                })
            }

    
    
            localVarHeaderParameter['Content-Type'] = 'multipart/form-data';
    
            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = localVarFormParams;

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * DocumentApi - functional programming interface
 * @export
 */
export const DocumentApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = DocumentApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary Get By Id
         * @param {string} documentId 
         * @param {string} dataSourceId 
         * @param {string} [attribute] 
         * @param {number} [depth] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async documentGetById(documentId: string, dataSourceId: string, attribute?: string, depth?: number, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<object>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.documentGetById(documentId, dataSourceId, attribute, depth, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Get a document by it\'s path in the form \"{dataSource}/{rootPackage}/{subPackage(s)?/{name}
         * @summary Get By Path
         * @param {string} dataSourceId 
         * @param {string} [attribute] 
         * @param {string} [path] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async documentGetByPath(dataSourceId: string, attribute?: string, path?: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<object>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.documentGetByPath(dataSourceId, attribute, path, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary Update
         * @param {string} documentId 
         * @param {string} dataSourceId 
         * @param {string} data 
         * @param {boolean} [updateUncontained] 
         * @param {string} [attribute] 
         * @param {Array<any>} [files] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async documentUpdate(documentId: string, dataSourceId: string, data: string, updateUncontained?: boolean, attribute?: string, files?: Array<any>, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.documentUpdate(documentId, dataSourceId, data, updateUncontained, attribute, files, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * DocumentApi - factory interface
 * @export
 */
export const DocumentApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = DocumentApiFp(configuration)
    return {
        /**
         * 
         * @summary Get By Id
         * @param {string} documentId 
         * @param {string} dataSourceId 
         * @param {string} [attribute] 
         * @param {number} [depth] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        documentGetById(documentId: string, dataSourceId: string, attribute?: string, depth?: number, options?: any): AxiosPromise<object> {
            return localVarFp.documentGetById(documentId, dataSourceId, attribute, depth, options).then((request) => request(axios, basePath));
        },
        /**
         * Get a document by it\'s path in the form \"{dataSource}/{rootPackage}/{subPackage(s)?/{name}
         * @summary Get By Path
         * @param {string} dataSourceId 
         * @param {string} [attribute] 
         * @param {string} [path] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        documentGetByPath(dataSourceId: string, attribute?: string, path?: string, options?: any): AxiosPromise<object> {
            return localVarFp.documentGetByPath(dataSourceId, attribute, path, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Update
         * @param {string} documentId 
         * @param {string} dataSourceId 
         * @param {string} data 
         * @param {boolean} [updateUncontained] 
         * @param {string} [attribute] 
         * @param {Array<any>} [files] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        documentUpdate(documentId: string, dataSourceId: string, data: string, updateUncontained?: boolean, attribute?: string, files?: Array<any>, options?: any): AxiosPromise<any> {
            return localVarFp.documentUpdate(documentId, dataSourceId, data, updateUncontained, attribute, files, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for documentGetById operation in DocumentApi.
 * @export
 * @interface DocumentApiDocumentGetByIdRequest
 */
export interface DocumentApiDocumentGetByIdRequest {
    /**
     * 
     * @type {string}
     * @memberof DocumentApiDocumentGetById
     */
    readonly documentId: string

    /**
     * 
     * @type {string}
     * @memberof DocumentApiDocumentGetById
     */
    readonly dataSourceId: string

    /**
     * 
     * @type {string}
     * @memberof DocumentApiDocumentGetById
     */
    readonly attribute?: string

    /**
     * 
     * @type {number}
     * @memberof DocumentApiDocumentGetById
     */
    readonly depth?: number
}

/**
 * Request parameters for documentGetByPath operation in DocumentApi.
 * @export
 * @interface DocumentApiDocumentGetByPathRequest
 */
export interface DocumentApiDocumentGetByPathRequest {
    /**
     * 
     * @type {string}
     * @memberof DocumentApiDocumentGetByPath
     */
    readonly dataSourceId: string

    /**
     * 
     * @type {string}
     * @memberof DocumentApiDocumentGetByPath
     */
    readonly attribute?: string

    /**
     * 
     * @type {string}
     * @memberof DocumentApiDocumentGetByPath
     */
    readonly path?: string
}

/**
 * Request parameters for documentUpdate operation in DocumentApi.
 * @export
 * @interface DocumentApiDocumentUpdateRequest
 */
export interface DocumentApiDocumentUpdateRequest {
    /**
     * 
     * @type {string}
     * @memberof DocumentApiDocumentUpdate
     */
    readonly documentId: string

    /**
     * 
     * @type {string}
     * @memberof DocumentApiDocumentUpdate
     */
    readonly dataSourceId: string

    /**
     * 
     * @type {string}
     * @memberof DocumentApiDocumentUpdate
     */
    readonly data: string

    /**
     * 
     * @type {boolean}
     * @memberof DocumentApiDocumentUpdate
     */
    readonly updateUncontained?: boolean

    /**
     * 
     * @type {string}
     * @memberof DocumentApiDocumentUpdate
     */
    readonly attribute?: string

    /**
     * 
     * @type {Array<any>}
     * @memberof DocumentApiDocumentUpdate
     */
    readonly files?: Array<any>
}

/**
 * DocumentApi - object-oriented interface
 * @export
 * @class DocumentApi
 * @extends {BaseAPI}
 */
export class DocumentApi extends BaseAPI {
    /**
     * 
     * @summary Get By Id
     * @param {DocumentApiDocumentGetByIdRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DocumentApi
     */
    public documentGetById(requestParameters: DocumentApiDocumentGetByIdRequest, options?: any) {
        return DocumentApiFp(this.configuration).documentGetById(requestParameters.documentId, requestParameters.dataSourceId, requestParameters.attribute, requestParameters.depth, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Get a document by it\'s path in the form \"{dataSource}/{rootPackage}/{subPackage(s)?/{name}
     * @summary Get By Path
     * @param {DocumentApiDocumentGetByPathRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DocumentApi
     */
    public documentGetByPath(requestParameters: DocumentApiDocumentGetByPathRequest, options?: any) {
        return DocumentApiFp(this.configuration).documentGetByPath(requestParameters.dataSourceId, requestParameters.attribute, requestParameters.path, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Update
     * @param {DocumentApiDocumentUpdateRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DocumentApi
     */
    public documentUpdate(requestParameters: DocumentApiDocumentUpdateRequest, options?: any) {
        return DocumentApiFp(this.configuration).documentUpdate(requestParameters.documentId, requestParameters.dataSourceId, requestParameters.data, requestParameters.updateUncontained, requestParameters.attribute, requestParameters.files, options).then((request) => request(this.axios, this.basePath));
    }
}
