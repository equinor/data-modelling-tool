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
import { Reference } from '../models';
/**
 * ReferenceApi - axios parameter creator
 * @export
 */
export const ReferenceApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Delete Reference
         * @param {string} dataSourceId 
         * @param {string} documentDottedId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        referenceDelete: async (dataSourceId: string, documentDottedId: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'dataSourceId' is not null or undefined
            assertParamExists('referenceDelete', 'dataSourceId', dataSourceId)
            // verify required parameter 'documentDottedId' is not null or undefined
            assertParamExists('referenceDelete', 'documentDottedId', documentDottedId)
            const localVarPath = `/api/v1/reference/{data_source_id}/{document_dotted_id}`
                .replace(`{${"data_source_id"}}`, encodeURIComponent(String(dataSourceId)))
                .replace(`{${"document_dotted_id"}}`, encodeURIComponent(String(documentDottedId)));
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
         * @summary Insert Reference
         * @param {string} dataSourceId 
         * @param {string} documentDottedId 
         * @param {Reference} reference 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        referenceInsert: async (dataSourceId: string, documentDottedId: string, reference: Reference, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'dataSourceId' is not null or undefined
            assertParamExists('referenceInsert', 'dataSourceId', dataSourceId)
            // verify required parameter 'documentDottedId' is not null or undefined
            assertParamExists('referenceInsert', 'documentDottedId', documentDottedId)
            // verify required parameter 'reference' is not null or undefined
            assertParamExists('referenceInsert', 'reference', reference)
            const localVarPath = `/api/v1/reference/{data_source_id}/{document_dotted_id}`
                .replace(`{${"data_source_id"}}`, encodeURIComponent(String(dataSourceId)))
                .replace(`{${"document_dotted_id"}}`, encodeURIComponent(String(documentDottedId)));
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
            localVarRequestOptions.data = serializeDataIfNeeded(reference, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * ReferenceApi - functional programming interface
 * @export
 */
export const ReferenceApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = ReferenceApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary Delete Reference
         * @param {string} dataSourceId 
         * @param {string} documentDottedId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async referenceDelete(dataSourceId: string, documentDottedId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<object>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.referenceDelete(dataSourceId, documentDottedId, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary Insert Reference
         * @param {string} dataSourceId 
         * @param {string} documentDottedId 
         * @param {Reference} reference 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async referenceInsert(dataSourceId: string, documentDottedId: string, reference: Reference, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<object>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.referenceInsert(dataSourceId, documentDottedId, reference, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * ReferenceApi - factory interface
 * @export
 */
export const ReferenceApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = ReferenceApiFp(configuration)
    return {
        /**
         * 
         * @summary Delete Reference
         * @param {string} dataSourceId 
         * @param {string} documentDottedId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        referenceDelete(dataSourceId: string, documentDottedId: string, options?: any): AxiosPromise<object> {
            return localVarFp.referenceDelete(dataSourceId, documentDottedId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Insert Reference
         * @param {string} dataSourceId 
         * @param {string} documentDottedId 
         * @param {Reference} reference 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        referenceInsert(dataSourceId: string, documentDottedId: string, reference: Reference, options?: any): AxiosPromise<object> {
            return localVarFp.referenceInsert(dataSourceId, documentDottedId, reference, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for referenceDelete operation in ReferenceApi.
 * @export
 * @interface ReferenceApiReferenceDeleteRequest
 */
export interface ReferenceApiReferenceDeleteRequest {
    /**
     * 
     * @type {string}
     * @memberof ReferenceApiReferenceDelete
     */
    readonly dataSourceId: string

    /**
     * 
     * @type {string}
     * @memberof ReferenceApiReferenceDelete
     */
    readonly documentDottedId: string
}

/**
 * Request parameters for referenceInsert operation in ReferenceApi.
 * @export
 * @interface ReferenceApiReferenceInsertRequest
 */
export interface ReferenceApiReferenceInsertRequest {
    /**
     * 
     * @type {string}
     * @memberof ReferenceApiReferenceInsert
     */
    readonly dataSourceId: string

    /**
     * 
     * @type {string}
     * @memberof ReferenceApiReferenceInsert
     */
    readonly documentDottedId: string

    /**
     * 
     * @type {Reference}
     * @memberof ReferenceApiReferenceInsert
     */
    readonly reference: Reference
}

/**
 * ReferenceApi - object-oriented interface
 * @export
 * @class ReferenceApi
 * @extends {BaseAPI}
 */
export class ReferenceApi extends BaseAPI {
    /**
     * 
     * @summary Delete Reference
     * @param {ReferenceApiReferenceDeleteRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ReferenceApi
     */
    public referenceDelete(requestParameters: ReferenceApiReferenceDeleteRequest, options?: any) {
        return ReferenceApiFp(this.configuration).referenceDelete(requestParameters.dataSourceId, requestParameters.documentDottedId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Insert Reference
     * @param {ReferenceApiReferenceInsertRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ReferenceApi
     */
    public referenceInsert(requestParameters: ReferenceApiReferenceInsertRequest, options?: any) {
        return ReferenceApiFp(this.configuration).referenceInsert(requestParameters.dataSourceId, requestParameters.documentDottedId, requestParameters.reference, options).then((request) => request(this.axios, this.basePath));
    }
}