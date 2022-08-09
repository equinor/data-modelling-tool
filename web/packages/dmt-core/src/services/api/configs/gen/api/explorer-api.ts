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
// @ts-ignore
import { MoveRequest } from '../models';
// @ts-ignore
import { RemoveByPathRequest } from '../models';
// @ts-ignore
import { RenameRequest } from '../models';
/**
 * ExplorerApi - axios parameter creator
 * @export
 */
export const ExplorerApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Add a new document to absolute ref (root of data source, or another document). If added to another document, a valid attribute type check is done. Select parent with format \'data_source/document_id.attribute.index.attribute\'
         * @summary Add By Parent Id
         * @param {string} absoluteRef 
         * @param {object} body 
         * @param {boolean} [updateUncontained] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        explorerAdd: async (absoluteRef: string, body: object, updateUncontained?: boolean, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'absoluteRef' is not null or undefined
            assertParamExists('explorerAdd', 'absoluteRef', absoluteRef)
            // verify required parameter 'body' is not null or undefined
            assertParamExists('explorerAdd', 'body', body)
            const localVarPath = `/api/v1/explorer/{absolute_ref}`
                .replace(`{${"absolute_ref"}}`, encodeURIComponent(String(absoluteRef)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication APIKeyHeader required
            await setApiKeyToObject(localVarHeaderParameter, "Access-Key", configuration)

            // authentication OAuth2AuthorizationCodeBearer required
            // oauth required
            await setOAuthToObject(localVarHeaderParameter, "OAuth2AuthorizationCodeBearer", [], configuration)

            if (updateUncontained !== undefined) {
                localVarQueryParameter['update_uncontained'] = updateUncontained;
            }


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(body, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Adds the document \'as-is\' to the datasource. NOTE: The \'explorer-add\' operation is to be preferred. This is mainly for bootstrapping and imports. Blueprint need not exist, and so there is no validation or splitting of entities. Posted document must be a valid Entity.
         * @summary Add Raw
         * @param {string} dataSourceId 
         * @param {object} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        explorerAddSimple: async (dataSourceId: string, body: object, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'dataSourceId' is not null or undefined
            assertParamExists('explorerAddSimple', 'dataSourceId', dataSourceId)
            // verify required parameter 'body' is not null or undefined
            assertParamExists('explorerAddSimple', 'body', body)
            const localVarPath = `/api/v1/explorer/{data_source_id}/add-raw`
                .replace(`{${"data_source_id"}}`, encodeURIComponent(String(dataSourceId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication APIKeyHeader required
            await setApiKeyToObject(localVarHeaderParameter, "Access-Key", configuration)

            // authentication OAuth2AuthorizationCodeBearer required
            // oauth required
            await setOAuthToObject(localVarHeaderParameter, "OAuth2AuthorizationCodeBearer", [], configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(body, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Same as \'add_to_parent\', but reference parent by path instead of ID. Also supports files.
         * @summary Add To Path
         * @param {string} dataSourceId 
         * @param {string} document 
         * @param {string} directory 
         * @param {boolean} [updateUncontained] 
         * @param {Array<any>} [files] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        explorerAddToPath: async (dataSourceId: string, document: string, directory: string, updateUncontained?: boolean, files?: Array<any>, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'dataSourceId' is not null or undefined
            assertParamExists('explorerAddToPath', 'dataSourceId', dataSourceId)
            // verify required parameter 'document' is not null or undefined
            assertParamExists('explorerAddToPath', 'document', document)
            // verify required parameter 'directory' is not null or undefined
            assertParamExists('explorerAddToPath', 'directory', directory)
            const localVarPath = `/api/v1/explorer/{data_source_id}/add-to-path`
                .replace(`{${"data_source_id"}}`, encodeURIComponent(String(dataSourceId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
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


            if (document !== undefined) { 
                localVarFormParams.append('document', document as any);
            }
    
            if (directory !== undefined) { 
                localVarFormParams.append('directory', directory as any);
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
        /**
         * 
         * @summary Move
         * @param {string} dataSourceId 
         * @param {MoveRequest} moveRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        explorerMove: async (dataSourceId: string, moveRequest: MoveRequest, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'dataSourceId' is not null or undefined
            assertParamExists('explorerMove', 'dataSourceId', dataSourceId)
            // verify required parameter 'moveRequest' is not null or undefined
            assertParamExists('explorerMove', 'moveRequest', moveRequest)
            const localVarPath = `/api/v1/explorer/{data_source_id}/move`
                .replace(`{${"data_source_id"}}`, encodeURIComponent(String(dataSourceId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication APIKeyHeader required
            await setApiKeyToObject(localVarHeaderParameter, "Access-Key", configuration)

            // authentication OAuth2AuthorizationCodeBearer required
            // oauth required
            await setOAuthToObject(localVarHeaderParameter, "OAuth2AuthorizationCodeBearer", [], configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(moveRequest, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Remove
         * @param {string} dataSourceId 
         * @param {string} dottedId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        explorerRemove: async (dataSourceId: string, dottedId: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'dataSourceId' is not null or undefined
            assertParamExists('explorerRemove', 'dataSourceId', dataSourceId)
            // verify required parameter 'dottedId' is not null or undefined
            assertParamExists('explorerRemove', 'dottedId', dottedId)
            const localVarPath = `/api/v1/explorer/{data_source_id}/{dotted_id}`
                .replace(`{${"data_source_id"}}`, encodeURIComponent(String(dataSourceId)))
                .replace(`{${"dotted_id"}}`, encodeURIComponent(String(dottedId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication APIKeyHeader required
            await setApiKeyToObject(localVarHeaderParameter, "Access-Key", configuration)

            // authentication OAuth2AuthorizationCodeBearer required
            // oauth required
            await setOAuthToObject(localVarHeaderParameter, "OAuth2AuthorizationCodeBearer", [], configuration)


    
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
         * @summary Remove By Path
         * @param {string} dataSourceId 
         * @param {RemoveByPathRequest} removeByPathRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        explorerRemoveByPath: async (dataSourceId: string, removeByPathRequest: RemoveByPathRequest, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'dataSourceId' is not null or undefined
            assertParamExists('explorerRemoveByPath', 'dataSourceId', dataSourceId)
            // verify required parameter 'removeByPathRequest' is not null or undefined
            assertParamExists('explorerRemoveByPath', 'removeByPathRequest', removeByPathRequest)
            const localVarPath = `/api/v1/explorer/{data_source_id}/remove-by-path`
                .replace(`{${"data_source_id"}}`, encodeURIComponent(String(dataSourceId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication APIKeyHeader required
            await setApiKeyToObject(localVarHeaderParameter, "Access-Key", configuration)

            // authentication OAuth2AuthorizationCodeBearer required
            // oauth required
            await setOAuthToObject(localVarHeaderParameter, "OAuth2AuthorizationCodeBearer", [], configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(removeByPathRequest, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Rename
         * @param {string} dataSourceId 
         * @param {RenameRequest} renameRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        explorerRename: async (dataSourceId: string, renameRequest: RenameRequest, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'dataSourceId' is not null or undefined
            assertParamExists('explorerRename', 'dataSourceId', dataSourceId)
            // verify required parameter 'renameRequest' is not null or undefined
            assertParamExists('explorerRename', 'renameRequest', renameRequest)
            const localVarPath = `/api/v1/explorer/{data_source_id}/rename`
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

            // authentication APIKeyHeader required
            await setApiKeyToObject(localVarHeaderParameter, "Access-Key", configuration)

            // authentication OAuth2AuthorizationCodeBearer required
            // oauth required
            await setOAuthToObject(localVarHeaderParameter, "OAuth2AuthorizationCodeBearer", [], configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(renameRequest, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * ExplorerApi - functional programming interface
 * @export
 */
export const ExplorerApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = ExplorerApiAxiosParamCreator(configuration)
    return {
        /**
         * Add a new document to absolute ref (root of data source, or another document). If added to another document, a valid attribute type check is done. Select parent with format \'data_source/document_id.attribute.index.attribute\'
         * @summary Add By Parent Id
         * @param {string} absoluteRef 
         * @param {object} body 
         * @param {boolean} [updateUncontained] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async explorerAdd(absoluteRef: string, body: object, updateUncontained?: boolean, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<object>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.explorerAdd(absoluteRef, body, updateUncontained, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Adds the document \'as-is\' to the datasource. NOTE: The \'explorer-add\' operation is to be preferred. This is mainly for bootstrapping and imports. Blueprint need not exist, and so there is no validation or splitting of entities. Posted document must be a valid Entity.
         * @summary Add Raw
         * @param {string} dataSourceId 
         * @param {object} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async explorerAddSimple(dataSourceId: string, body: object, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.explorerAddSimple(dataSourceId, body, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Same as \'add_to_parent\', but reference parent by path instead of ID. Also supports files.
         * @summary Add To Path
         * @param {string} dataSourceId 
         * @param {string} document 
         * @param {string} directory 
         * @param {boolean} [updateUncontained] 
         * @param {Array<any>} [files] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async explorerAddToPath(dataSourceId: string, document: string, directory: string, updateUncontained?: boolean, files?: Array<any>, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<object>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.explorerAddToPath(dataSourceId, document, directory, updateUncontained, files, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary Move
         * @param {string} dataSourceId 
         * @param {MoveRequest} moveRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async explorerMove(dataSourceId: string, moveRequest: MoveRequest, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.explorerMove(dataSourceId, moveRequest, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary Remove
         * @param {string} dataSourceId 
         * @param {string} dottedId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async explorerRemove(dataSourceId: string, dottedId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.explorerRemove(dataSourceId, dottedId, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary Remove By Path
         * @param {string} dataSourceId 
         * @param {RemoveByPathRequest} removeByPathRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async explorerRemoveByPath(dataSourceId: string, removeByPathRequest: RemoveByPathRequest, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.explorerRemoveByPath(dataSourceId, removeByPathRequest, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary Rename
         * @param {string} dataSourceId 
         * @param {RenameRequest} renameRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async explorerRename(dataSourceId: string, renameRequest: RenameRequest, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<object>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.explorerRename(dataSourceId, renameRequest, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * ExplorerApi - factory interface
 * @export
 */
export const ExplorerApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = ExplorerApiFp(configuration)
    return {
        /**
         * Add a new document to absolute ref (root of data source, or another document). If added to another document, a valid attribute type check is done. Select parent with format \'data_source/document_id.attribute.index.attribute\'
         * @summary Add By Parent Id
         * @param {string} absoluteRef 
         * @param {object} body 
         * @param {boolean} [updateUncontained] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        explorerAdd(absoluteRef: string, body: object, updateUncontained?: boolean, options?: any): AxiosPromise<object> {
            return localVarFp.explorerAdd(absoluteRef, body, updateUncontained, options).then((request) => request(axios, basePath));
        },
        /**
         * Adds the document \'as-is\' to the datasource. NOTE: The \'explorer-add\' operation is to be preferred. This is mainly for bootstrapping and imports. Blueprint need not exist, and so there is no validation or splitting of entities. Posted document must be a valid Entity.
         * @summary Add Raw
         * @param {string} dataSourceId 
         * @param {object} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        explorerAddSimple(dataSourceId: string, body: object, options?: any): AxiosPromise<string> {
            return localVarFp.explorerAddSimple(dataSourceId, body, options).then((request) => request(axios, basePath));
        },
        /**
         * Same as \'add_to_parent\', but reference parent by path instead of ID. Also supports files.
         * @summary Add To Path
         * @param {string} dataSourceId 
         * @param {string} document 
         * @param {string} directory 
         * @param {boolean} [updateUncontained] 
         * @param {Array<any>} [files] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        explorerAddToPath(dataSourceId: string, document: string, directory: string, updateUncontained?: boolean, files?: Array<any>, options?: any): AxiosPromise<object> {
            return localVarFp.explorerAddToPath(dataSourceId, document, directory, updateUncontained, files, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Move
         * @param {string} dataSourceId 
         * @param {MoveRequest} moveRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        explorerMove(dataSourceId: string, moveRequest: MoveRequest, options?: any): AxiosPromise<string> {
            return localVarFp.explorerMove(dataSourceId, moveRequest, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Remove
         * @param {string} dataSourceId 
         * @param {string} dottedId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        explorerRemove(dataSourceId: string, dottedId: string, options?: any): AxiosPromise<string> {
            return localVarFp.explorerRemove(dataSourceId, dottedId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Remove By Path
         * @param {string} dataSourceId 
         * @param {RemoveByPathRequest} removeByPathRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        explorerRemoveByPath(dataSourceId: string, removeByPathRequest: RemoveByPathRequest, options?: any): AxiosPromise<string> {
            return localVarFp.explorerRemoveByPath(dataSourceId, removeByPathRequest, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Rename
         * @param {string} dataSourceId 
         * @param {RenameRequest} renameRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        explorerRename(dataSourceId: string, renameRequest: RenameRequest, options?: any): AxiosPromise<object> {
            return localVarFp.explorerRename(dataSourceId, renameRequest, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for explorerAdd operation in ExplorerApi.
 * @export
 * @interface ExplorerApiExplorerAddRequest
 */
export interface ExplorerApiExplorerAddRequest {
    /**
     * 
     * @type {string}
     * @memberof ExplorerApiExplorerAdd
     */
    readonly absoluteRef: string

    /**
     * 
     * @type {object}
     * @memberof ExplorerApiExplorerAdd
     */
    readonly body: object

    /**
     * 
     * @type {boolean}
     * @memberof ExplorerApiExplorerAdd
     */
    readonly updateUncontained?: boolean
}

/**
 * Request parameters for explorerAddSimple operation in ExplorerApi.
 * @export
 * @interface ExplorerApiExplorerAddSimpleRequest
 */
export interface ExplorerApiExplorerAddSimpleRequest {
    /**
     * 
     * @type {string}
     * @memberof ExplorerApiExplorerAddSimple
     */
    readonly dataSourceId: string

    /**
     * 
     * @type {object}
     * @memberof ExplorerApiExplorerAddSimple
     */
    readonly body: object
}

/**
 * Request parameters for explorerAddToPath operation in ExplorerApi.
 * @export
 * @interface ExplorerApiExplorerAddToPathRequest
 */
export interface ExplorerApiExplorerAddToPathRequest {
    /**
     * 
     * @type {string}
     * @memberof ExplorerApiExplorerAddToPath
     */
    readonly dataSourceId: string

    /**
     * 
     * @type {string}
     * @memberof ExplorerApiExplorerAddToPath
     */
    readonly document: string

    /**
     * 
     * @type {string}
     * @memberof ExplorerApiExplorerAddToPath
     */
    readonly directory: string

    /**
     * 
     * @type {boolean}
     * @memberof ExplorerApiExplorerAddToPath
     */
    readonly updateUncontained?: boolean

    /**
     * 
     * @type {Array<any>}
     * @memberof ExplorerApiExplorerAddToPath
     */
    readonly files?: Array<any>
}

/**
 * Request parameters for explorerMove operation in ExplorerApi.
 * @export
 * @interface ExplorerApiExplorerMoveRequest
 */
export interface ExplorerApiExplorerMoveRequest {
    /**
     * 
     * @type {string}
     * @memberof ExplorerApiExplorerMove
     */
    readonly dataSourceId: string

    /**
     * 
     * @type {MoveRequest}
     * @memberof ExplorerApiExplorerMove
     */
    readonly moveRequest: MoveRequest
}

/**
 * Request parameters for explorerRemove operation in ExplorerApi.
 * @export
 * @interface ExplorerApiExplorerRemoveRequest
 */
export interface ExplorerApiExplorerRemoveRequest {
    /**
     * 
     * @type {string}
     * @memberof ExplorerApiExplorerRemove
     */
    readonly dataSourceId: string

    /**
     * 
     * @type {string}
     * @memberof ExplorerApiExplorerRemove
     */
    readonly dottedId: string
}

/**
 * Request parameters for explorerRemoveByPath operation in ExplorerApi.
 * @export
 * @interface ExplorerApiExplorerRemoveByPathRequest
 */
export interface ExplorerApiExplorerRemoveByPathRequest {
    /**
     * 
     * @type {string}
     * @memberof ExplorerApiExplorerRemoveByPath
     */
    readonly dataSourceId: string

    /**
     * 
     * @type {RemoveByPathRequest}
     * @memberof ExplorerApiExplorerRemoveByPath
     */
    readonly removeByPathRequest: RemoveByPathRequest
}

/**
 * Request parameters for explorerRename operation in ExplorerApi.
 * @export
 * @interface ExplorerApiExplorerRenameRequest
 */
export interface ExplorerApiExplorerRenameRequest {
    /**
     * 
     * @type {string}
     * @memberof ExplorerApiExplorerRename
     */
    readonly dataSourceId: string

    /**
     * 
     * @type {RenameRequest}
     * @memberof ExplorerApiExplorerRename
     */
    readonly renameRequest: RenameRequest
}

/**
 * ExplorerApi - object-oriented interface
 * @export
 * @class ExplorerApi
 * @extends {BaseAPI}
 */
export class ExplorerApi extends BaseAPI {
    /**
     * Add a new document to absolute ref (root of data source, or another document). If added to another document, a valid attribute type check is done. Select parent with format \'data_source/document_id.attribute.index.attribute\'
     * @summary Add By Parent Id
     * @param {ExplorerApiExplorerAddRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ExplorerApi
     */
    public explorerAdd(requestParameters: ExplorerApiExplorerAddRequest, options?: any) {
        return ExplorerApiFp(this.configuration).explorerAdd(requestParameters.absoluteRef, requestParameters.body, requestParameters.updateUncontained, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Adds the document \'as-is\' to the datasource. NOTE: The \'explorer-add\' operation is to be preferred. This is mainly for bootstrapping and imports. Blueprint need not exist, and so there is no validation or splitting of entities. Posted document must be a valid Entity.
     * @summary Add Raw
     * @param {ExplorerApiExplorerAddSimpleRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ExplorerApi
     */
    public explorerAddSimple(requestParameters: ExplorerApiExplorerAddSimpleRequest, options?: any) {
        return ExplorerApiFp(this.configuration).explorerAddSimple(requestParameters.dataSourceId, requestParameters.body, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Same as \'add_to_parent\', but reference parent by path instead of ID. Also supports files.
     * @summary Add To Path
     * @param {ExplorerApiExplorerAddToPathRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ExplorerApi
     */
    public explorerAddToPath(requestParameters: ExplorerApiExplorerAddToPathRequest, options?: any) {
        return ExplorerApiFp(this.configuration).explorerAddToPath(requestParameters.dataSourceId, requestParameters.document, requestParameters.directory, requestParameters.updateUncontained, requestParameters.files, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Move
     * @param {ExplorerApiExplorerMoveRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ExplorerApi
     */
    public explorerMove(requestParameters: ExplorerApiExplorerMoveRequest, options?: any) {
        return ExplorerApiFp(this.configuration).explorerMove(requestParameters.dataSourceId, requestParameters.moveRequest, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Remove
     * @param {ExplorerApiExplorerRemoveRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ExplorerApi
     */
    public explorerRemove(requestParameters: ExplorerApiExplorerRemoveRequest, options?: any) {
        return ExplorerApiFp(this.configuration).explorerRemove(requestParameters.dataSourceId, requestParameters.dottedId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Remove By Path
     * @param {ExplorerApiExplorerRemoveByPathRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ExplorerApi
     */
    public explorerRemoveByPath(requestParameters: ExplorerApiExplorerRemoveByPathRequest, options?: any) {
        return ExplorerApiFp(this.configuration).explorerRemoveByPath(requestParameters.dataSourceId, requestParameters.removeByPathRequest, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Rename
     * @param {ExplorerApiExplorerRenameRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ExplorerApi
     */
    public explorerRename(requestParameters: ExplorerApiExplorerRenameRequest, options?: any) {
        return ExplorerApiFp(this.configuration).explorerRename(requestParameters.dataSourceId, requestParameters.renameRequest, options).then((request) => request(this.axios, this.basePath));
    }
}