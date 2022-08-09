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
/**
 * HealthCheckApi - axios parameter creator
 * @export
 */
export const HealthCheckApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Get
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getApiV1HealthcheckGet: async (options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/v1/healthcheck`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * HealthCheckApi - functional programming interface
 * @export
 */
export const HealthCheckApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = HealthCheckApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary Get
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getApiV1HealthcheckGet(options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getApiV1HealthcheckGet(options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * HealthCheckApi - factory interface
 * @export
 */
export const HealthCheckApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = HealthCheckApiFp(configuration)
    return {
        /**
         * 
         * @summary Get
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getApiV1HealthcheckGet(options?: any): AxiosPromise<string> {
            return localVarFp.getApiV1HealthcheckGet(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * HealthCheckApi - object-oriented interface
 * @export
 * @class HealthCheckApi
 * @extends {BaseAPI}
 */
export class HealthCheckApi extends BaseAPI {
    /**
     * 
     * @summary Get
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof HealthCheckApi
     */
    public getApiV1HealthcheckGet(options?: any) {
        return HealthCheckApiFp(this.configuration).getApiV1HealthcheckGet(options).then((request) => request(this.axios, this.basePath));
    }
}