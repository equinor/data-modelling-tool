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
import { ACL } from '../models';
// @ts-ignore
import { ErrorResponse } from '../models';
/**
 * AccessControlApi - axios parameter creator
 * @export
 */
export const AccessControlApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Get Acl
         * @param {string} dataSourceId 
         * @param {string} documentId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAcl: async (dataSourceId: string, documentId: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'dataSourceId' is not null or undefined
            assertParamExists('getAcl', 'dataSourceId', dataSourceId)
            // verify required parameter 'documentId' is not null or undefined
            assertParamExists('getAcl', 'documentId', documentId)
            const localVarPath = `/api/v1/acl/{data_source_id}/{document_id}`
                .replace(`{${"data_source_id"}}`, encodeURIComponent(String(dataSourceId)))
                .replace(`{${"document_id"}}`, encodeURIComponent(String(documentId)));
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
         * @summary Set Acl
         * @param {string} dataSourceId 
         * @param {string} documentId 
         * @param {ACL} aCL 
         * @param {boolean} [recursively] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        setAcl: async (dataSourceId: string, documentId: string, aCL: ACL, recursively?: boolean, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'dataSourceId' is not null or undefined
            assertParamExists('setAcl', 'dataSourceId', dataSourceId)
            // verify required parameter 'documentId' is not null or undefined
            assertParamExists('setAcl', 'documentId', documentId)
            // verify required parameter 'aCL' is not null or undefined
            assertParamExists('setAcl', 'aCL', aCL)
            const localVarPath = `/api/v1/acl/{data_source_id}/{document_id}`
                .replace(`{${"data_source_id"}}`, encodeURIComponent(String(dataSourceId)))
                .replace(`{${"document_id"}}`, encodeURIComponent(String(documentId)));
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

            if (recursively !== undefined) {
                localVarQueryParameter['recursively'] = recursively;
            }


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(aCL, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * AccessControlApi - functional programming interface
 * @export
 */
export const AccessControlApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = AccessControlApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary Get Acl
         * @param {string} dataSourceId 
         * @param {string} documentId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getAcl(dataSourceId: string, documentId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ACL>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getAcl(dataSourceId, documentId, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary Set Acl
         * @param {string} dataSourceId 
         * @param {string} documentId 
         * @param {ACL} aCL 
         * @param {boolean} [recursively] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async setAcl(dataSourceId: string, documentId: string, aCL: ACL, recursively?: boolean, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.setAcl(dataSourceId, documentId, aCL, recursively, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * AccessControlApi - factory interface
 * @export
 */
export const AccessControlApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = AccessControlApiFp(configuration)
    return {
        /**
         * 
         * @summary Get Acl
         * @param {string} dataSourceId 
         * @param {string} documentId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAcl(dataSourceId: string, documentId: string, options?: any): AxiosPromise<ACL> {
            return localVarFp.getAcl(dataSourceId, documentId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Set Acl
         * @param {string} dataSourceId 
         * @param {string} documentId 
         * @param {ACL} aCL 
         * @param {boolean} [recursively] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        setAcl(dataSourceId: string, documentId: string, aCL: ACL, recursively?: boolean, options?: any): AxiosPromise<string> {
            return localVarFp.setAcl(dataSourceId, documentId, aCL, recursively, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for getAcl operation in AccessControlApi.
 * @export
 * @interface AccessControlApiGetAclRequest
 */
export interface AccessControlApiGetAclRequest {
    /**
     * 
     * @type {string}
     * @memberof AccessControlApiGetAcl
     */
    readonly dataSourceId: string

    /**
     * 
     * @type {string}
     * @memberof AccessControlApiGetAcl
     */
    readonly documentId: string
}

/**
 * Request parameters for setAcl operation in AccessControlApi.
 * @export
 * @interface AccessControlApiSetAclRequest
 */
export interface AccessControlApiSetAclRequest {
    /**
     * 
     * @type {string}
     * @memberof AccessControlApiSetAcl
     */
    readonly dataSourceId: string

    /**
     * 
     * @type {string}
     * @memberof AccessControlApiSetAcl
     */
    readonly documentId: string

    /**
     * 
     * @type {ACL}
     * @memberof AccessControlApiSetAcl
     */
    readonly aCL: ACL

    /**
     * 
     * @type {boolean}
     * @memberof AccessControlApiSetAcl
     */
    readonly recursively?: boolean
}

/**
 * AccessControlApi - object-oriented interface
 * @export
 * @class AccessControlApi
 * @extends {BaseAPI}
 */
export class AccessControlApi extends BaseAPI {
    /**
     * 
     * @summary Get Acl
     * @param {AccessControlApiGetAclRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AccessControlApi
     */
    public getAcl(requestParameters: AccessControlApiGetAclRequest, options?: any) {
        return AccessControlApiFp(this.configuration).getAcl(requestParameters.dataSourceId, requestParameters.documentId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Set Acl
     * @param {AccessControlApiSetAclRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AccessControlApi
     */
    public setAcl(requestParameters: AccessControlApiSetAclRequest, options?: any) {
        return AccessControlApiFp(this.configuration).setAcl(requestParameters.dataSourceId, requestParameters.documentId, requestParameters.aCL, requestParameters.recursively, options).then((request) => request(this.axios, this.basePath));
    }
}
