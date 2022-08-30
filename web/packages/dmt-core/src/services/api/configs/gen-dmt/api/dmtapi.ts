/* tslint:disable */
/* eslint-disable */
/**
 * Data Modelling Tool
 * API for Data Modeling Tool (DMT)
 *
 * The version of the OpenAPI document: 0.1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import globalAxios, { AxiosPromise, AxiosInstance } from 'axios'
import { Configuration } from '../configuration'
// Some imports not used depending on template conditions
// @ts-ignore
import {
  DUMMY_BASE_URL,
  assertParamExists,
  setApiKeyToObject,
  setBasicAuthToObject,
  setBearerAuthToObject,
  setOAuthToObject,
  setSearchParams,
  serializeDataIfNeeded,
  toPathString,
  createRequestFunction,
} from '../common'
// @ts-ignore
import {
  BASE_PATH,
  COLLECTION_FORMATS,
  RequestArgs,
  BaseAPI,
  RequiredError,
} from '../base'
// @ts-ignore
import { BasicEntity } from '../models'
// @ts-ignore
import { ErrorResponse } from '../models'
// @ts-ignore
import { GetJobResultResponse } from '../models'
// @ts-ignore
import { StartJobResponse } from '../models'
// @ts-ignore
import { StatusJobResponse } from '../models'
/**
 * DMTApi - axios parameter creator
 * @export
 */
export const DMTApiAxiosParamCreator = function (
  configuration?: Configuration
) {
  return {
    /**
     *
     * @summary Create Application
     * @param {string} dataSourceId
     * @param {string} applicationId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    createApp: async (
      dataSourceId: string,
      applicationId: string,
      options: any = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'dataSourceId' is not null or undefined
      assertParamExists('createApp', 'dataSourceId', dataSourceId)
      // verify required parameter 'applicationId' is not null or undefined
      assertParamExists('createApp', 'applicationId', applicationId)
      const localVarPath = `/api/v1/system/{data_source_id}/create-application/{application_id}`
        .replace(
          `{${'data_source_id'}}`,
          encodeURIComponent(String(dataSourceId))
        )
        .replace(
          `{${'application_id'}}`,
          encodeURIComponent(String(applicationId))
        )
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL)
      let baseOptions
      if (configuration) {
        baseOptions = configuration.baseOptions
      }

      const localVarRequestOptions = {
        method: 'GET',
        ...baseOptions,
        ...options,
      }
      const localVarHeaderParameter = {} as any
      const localVarQueryParameter = {} as any

      setSearchParams(localVarUrlObj, localVarQueryParameter, options.query)
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {}
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      }

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      }
    },
    /**
     *
     * @summary Generate Code With Plugin
     * @param {string} dataSourceId
     * @param {string} pluginName
     * @param {string} documentPath
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    generateCode: async (
      dataSourceId: string,
      pluginName: string,
      documentPath: string,
      options: any = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'dataSourceId' is not null or undefined
      assertParamExists('generateCode', 'dataSourceId', dataSourceId)
      // verify required parameter 'pluginName' is not null or undefined
      assertParamExists('generateCode', 'pluginName', pluginName)
      // verify required parameter 'documentPath' is not null or undefined
      assertParamExists('generateCode', 'documentPath', documentPath)
      const localVarPath = `/api/v1/system/{data_source_id}/generate-code/{plugin_name}/{document_path}`
        .replace(
          `{${'data_source_id'}}`,
          encodeURIComponent(String(dataSourceId))
        )
        .replace(`{${'plugin_name'}}`, encodeURIComponent(String(pluginName)))
        .replace(
          `{${'document_path'}}`,
          encodeURIComponent(String(documentPath))
        )
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL)
      let baseOptions
      if (configuration) {
        baseOptions = configuration.baseOptions
      }

      const localVarRequestOptions = {
        method: 'GET',
        ...baseOptions,
        ...options,
      }
      const localVarHeaderParameter = {} as any
      const localVarQueryParameter = {} as any

      setSearchParams(localVarUrlObj, localVarQueryParameter, options.query)
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {}
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      }

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      }
    },
    /**
     *
     * @summary Get Application Settings
     * @param {string} [applicationName]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getAppSettings: async (
      applicationName?: string,
      options: any = {}
    ): Promise<RequestArgs> => {
      const localVarPath = `/api/v1/system/settings`
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL)
      let baseOptions
      if (configuration) {
        baseOptions = configuration.baseOptions
      }

      const localVarRequestOptions = {
        method: 'GET',
        ...baseOptions,
        ...options,
      }
      const localVarHeaderParameter = {} as any
      const localVarQueryParameter = {} as any

      if (applicationName !== undefined) {
        localVarQueryParameter['application_name'] = applicationName
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter, options.query)
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {}
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      }

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      }
    },
    /**
     *
     * @summary Get
     * @param {string} target
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getBlueprints: async (
      target: string,
      options: any = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'target' is not null or undefined
      assertParamExists('getBlueprints', 'target', target)
      const localVarPath = `/api/v1/blueprints/{target}`.replace(
        `{${'target'}}`,
        encodeURIComponent(String(target))
      )
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL)
      let baseOptions
      if (configuration) {
        baseOptions = configuration.baseOptions
      }

      const localVarRequestOptions = {
        method: 'GET',
        ...baseOptions,
        ...options,
      }
      const localVarHeaderParameter = {} as any
      const localVarQueryParameter = {} as any

      setSearchParams(localVarUrlObj, localVarQueryParameter, options.query)
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {}
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      }

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      }
    },
    /**
     *
     * @summary Instantiate
     * @param {BasicEntity} basicEntity
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    instantiateEntity: async (
      basicEntity: BasicEntity,
      options: any = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'basicEntity' is not null or undefined
      assertParamExists('instantiateEntity', 'basicEntity', basicEntity)
      const localVarPath = `/api/v1/entity`
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL)
      let baseOptions
      if (configuration) {
        baseOptions = configuration.baseOptions
      }

      const localVarRequestOptions = {
        method: 'POST',
        ...baseOptions,
        ...options,
      }
      const localVarHeaderParameter = {} as any
      const localVarQueryParameter = {} as any

      localVarHeaderParameter['Content-Type'] = 'application/json'

      setSearchParams(localVarUrlObj, localVarQueryParameter, options.query)
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {}
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      }
      localVarRequestOptions.data = serializeDataIfNeeded(
        basicEntity,
        localVarRequestOptions,
        configuration
      )

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      }
    },
    /**
     *
     * @summary Result
     * @param {string} jobUid
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    jobResult: async (
      jobUid: string,
      options: any = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'jobUid' is not null or undefined
      assertParamExists('jobResult', 'jobUid', jobUid)
      const localVarPath = `/api/v1/job/{job_uid}/result`.replace(
        `{${'job_uid'}}`,
        encodeURIComponent(String(jobUid))
      )
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL)
      let baseOptions
      if (configuration) {
        baseOptions = configuration.baseOptions
      }

      const localVarRequestOptions = {
        method: 'GET',
        ...baseOptions,
        ...options,
      }
      const localVarHeaderParameter = {} as any
      const localVarQueryParameter = {} as any

      setSearchParams(localVarUrlObj, localVarQueryParameter, options.query)
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {}
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      }

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      }
    },
    /**
     *
     * @summary Status
     * @param {string} jobUid
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    jobStatus: async (
      jobUid: string,
      options: any = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'jobUid' is not null or undefined
      assertParamExists('jobStatus', 'jobUid', jobUid)
      const localVarPath = `/api/v1/job/{job_uid}`.replace(
        `{${'job_uid'}}`,
        encodeURIComponent(String(jobUid))
      )
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL)
      let baseOptions
      if (configuration) {
        baseOptions = configuration.baseOptions
      }

      const localVarRequestOptions = {
        method: 'GET',
        ...baseOptions,
        ...options,
      }
      const localVarHeaderParameter = {} as any
      const localVarQueryParameter = {} as any

      setSearchParams(localVarUrlObj, localVarQueryParameter, options.query)
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {}
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      }

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      }
    },
    /**
     *
     * @summary Remove
     * @param {string} jobUid
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    removeJob: async (
      jobUid: string,
      options: any = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'jobUid' is not null or undefined
      assertParamExists('removeJob', 'jobUid', jobUid)
      const localVarPath = `/api/v1/job/{job_uid}`.replace(
        `{${'job_uid'}}`,
        encodeURIComponent(String(jobUid))
      )
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL)
      let baseOptions
      if (configuration) {
        baseOptions = configuration.baseOptions
      }

      const localVarRequestOptions = {
        method: 'DELETE',
        ...baseOptions,
        ...options,
      }
      const localVarHeaderParameter = {} as any
      const localVarQueryParameter = {} as any

      setSearchParams(localVarUrlObj, localVarQueryParameter, options.query)
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {}
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      }

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      }
    },
    /**
     *
     * @summary Set Application Settings
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    setAppSettings: async (options: any = {}): Promise<RequestArgs> => {
      const localVarPath = `/api/v1/system/settings`
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL)
      let baseOptions
      if (configuration) {
        baseOptions = configuration.baseOptions
      }

      const localVarRequestOptions = {
        method: 'POST',
        ...baseOptions,
        ...options,
      }
      const localVarHeaderParameter = {} as any
      const localVarQueryParameter = {} as any

      setSearchParams(localVarUrlObj, localVarQueryParameter, options.query)
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {}
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      }

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      }
    },
    /**
     *
     * @summary Start
     * @param {string} jobDmssId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    startJob: async (
      jobDmssId: string,
      options: any = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'jobDmssId' is not null or undefined
      assertParamExists('startJob', 'jobDmssId', jobDmssId)
      const localVarPath = `/api/v1/job/{job_dmss_id}`.replace(
        `{${'job_dmss_id'}}`,
        encodeURIComponent(String(jobDmssId))
      )
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL)
      let baseOptions
      if (configuration) {
        baseOptions = configuration.baseOptions
      }

      const localVarRequestOptions = {
        method: 'POST',
        ...baseOptions,
        ...options,
      }
      const localVarHeaderParameter = {} as any
      const localVarQueryParameter = {} as any

      setSearchParams(localVarUrlObj, localVarQueryParameter, options.query)
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {}
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      }

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      }
    },
  }
}

/**
 * DMTApi - functional programming interface
 * @export
 */
export const DMTApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = DMTApiAxiosParamCreator(configuration)
  return {
    /**
     *
     * @summary Create Application
     * @param {string} dataSourceId
     * @param {string} applicationId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async createApp(
      dataSourceId: string,
      applicationId: string,
      options?: any
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.createApp(
        dataSourceId,
        applicationId,
        options
      )
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration
      )
    },
    /**
     *
     * @summary Generate Code With Plugin
     * @param {string} dataSourceId
     * @param {string} pluginName
     * @param {string} documentPath
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async generateCode(
      dataSourceId: string,
      pluginName: string,
      documentPath: string,
      options?: any
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.generateCode(
        dataSourceId,
        pluginName,
        documentPath,
        options
      )
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration
      )
    },
    /**
     *
     * @summary Get Application Settings
     * @param {string} [applicationName]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async getAppSettings(
      applicationName?: string,
      options?: any
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.getAppSettings(
        applicationName,
        options
      )
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration
      )
    },
    /**
     *
     * @summary Get
     * @param {string} target
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async getBlueprints(
      target: string,
      options?: any
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.getBlueprints(
        target,
        options
      )
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration
      )
    },
    /**
     *
     * @summary Instantiate
     * @param {BasicEntity} basicEntity
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async instantiateEntity(
      basicEntity: BasicEntity,
      options?: any
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.instantiateEntity(
        basicEntity,
        options
      )
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration
      )
    },
    /**
     *
     * @summary Result
     * @param {string} jobUid
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async jobResult(
      jobUid: string,
      options?: any
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string
      ) => AxiosPromise<GetJobResultResponse>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.jobResult(
        jobUid,
        options
      )
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration
      )
    },
    /**
     *
     * @summary Status
     * @param {string} jobUid
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async jobStatus(
      jobUid: string,
      options?: any
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string
      ) => AxiosPromise<StatusJobResponse>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.jobStatus(
        jobUid,
        options
      )
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration
      )
    },
    /**
     *
     * @summary Remove
     * @param {string} jobUid
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async removeJob(
      jobUid: string,
      options?: any
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.removeJob(
        jobUid,
        options
      )
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration
      )
    },
    /**
     *
     * @summary Set Application Settings
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async setAppSettings(
      options?: any
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.setAppSettings(
        options
      )
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration
      )
    },
    /**
     *
     * @summary Start
     * @param {string} jobDmssId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async startJob(
      jobDmssId: string,
      options?: any
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string
      ) => AxiosPromise<StartJobResponse>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.startJob(
        jobDmssId,
        options
      )
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration
      )
    },
  }
}

/**
 * DMTApi - factory interface
 * @export
 */
export const DMTApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = DMTApiFp(configuration)
  return {
    /**
     *
     * @summary Create Application
     * @param {string} dataSourceId
     * @param {string} applicationId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    createApp(
      dataSourceId: string,
      applicationId: string,
      options?: any
    ): AxiosPromise<any> {
      return localVarFp
        .createApp(dataSourceId, applicationId, options)
        .then((request) => request(axios, basePath))
    },
    /**
     *
     * @summary Generate Code With Plugin
     * @param {string} dataSourceId
     * @param {string} pluginName
     * @param {string} documentPath
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    generateCode(
      dataSourceId: string,
      pluginName: string,
      documentPath: string,
      options?: any
    ): AxiosPromise<any> {
      return localVarFp
        .generateCode(dataSourceId, pluginName, documentPath, options)
        .then((request) => request(axios, basePath))
    },
    /**
     *
     * @summary Get Application Settings
     * @param {string} [applicationName]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getAppSettings(applicationName?: string, options?: any): AxiosPromise<any> {
      return localVarFp
        .getAppSettings(applicationName, options)
        .then((request) => request(axios, basePath))
    },
    /**
     *
     * @summary Get
     * @param {string} target
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getBlueprints(target: string, options?: any): AxiosPromise<any> {
      return localVarFp
        .getBlueprints(target, options)
        .then((request) => request(axios, basePath))
    },
    /**
     *
     * @summary Instantiate
     * @param {BasicEntity} basicEntity
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    instantiateEntity(
      basicEntity: BasicEntity,
      options?: any
    ): AxiosPromise<any> {
      return localVarFp
        .instantiateEntity(basicEntity, options)
        .then((request) => request(axios, basePath))
    },
    /**
     *
     * @summary Result
     * @param {string} jobUid
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    jobResult(
      jobUid: string,
      options?: any
    ): AxiosPromise<GetJobResultResponse> {
      return localVarFp
        .jobResult(jobUid, options)
        .then((request) => request(axios, basePath))
    },
    /**
     *
     * @summary Status
     * @param {string} jobUid
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    jobStatus(jobUid: string, options?: any): AxiosPromise<StatusJobResponse> {
      return localVarFp
        .jobStatus(jobUid, options)
        .then((request) => request(axios, basePath))
    },
    /**
     *
     * @summary Remove
     * @param {string} jobUid
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    removeJob(jobUid: string, options?: any): AxiosPromise<any> {
      return localVarFp
        .removeJob(jobUid, options)
        .then((request) => request(axios, basePath))
    },
    /**
     *
     * @summary Set Application Settings
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    setAppSettings(options?: any): AxiosPromise<any> {
      return localVarFp
        .setAppSettings(options)
        .then((request) => request(axios, basePath))
    },
    /**
     *
     * @summary Start
     * @param {string} jobDmssId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    startJob(jobDmssId: string, options?: any): AxiosPromise<StartJobResponse> {
      return localVarFp
        .startJob(jobDmssId, options)
        .then((request) => request(axios, basePath))
    },
  }
}

/**
 * Request parameters for createApp operation in DMTApi.
 * @export
 * @interface DMTApiCreateAppRequest
 */
export interface DMTApiCreateAppRequest {
  /**
   *
   * @type {string}
   * @memberof DMTApiCreateApp
   */
  readonly dataSourceId: string

  /**
   *
   * @type {string}
   * @memberof DMTApiCreateApp
   */
  readonly applicationId: string
}

/**
 * Request parameters for generateCode operation in DMTApi.
 * @export
 * @interface DMTApiGenerateCodeRequest
 */
export interface DMTApiGenerateCodeRequest {
  /**
   *
   * @type {string}
   * @memberof DMTApiGenerateCode
   */
  readonly dataSourceId: string

  /**
   *
   * @type {string}
   * @memberof DMTApiGenerateCode
   */
  readonly pluginName: string

  /**
   *
   * @type {string}
   * @memberof DMTApiGenerateCode
   */
  readonly documentPath: string
}

/**
 * Request parameters for getAppSettings operation in DMTApi.
 * @export
 * @interface DMTApiGetAppSettingsRequest
 */
export interface DMTApiGetAppSettingsRequest {
  /**
   *
   * @type {string}
   * @memberof DMTApiGetAppSettings
   */
  readonly applicationName?: string
}

/**
 * Request parameters for getBlueprints operation in DMTApi.
 * @export
 * @interface DMTApiGetBlueprintsRequest
 */
export interface DMTApiGetBlueprintsRequest {
  /**
   *
   * @type {string}
   * @memberof DMTApiGetBlueprints
   */
  readonly target: string
}

/**
 * Request parameters for instantiateEntity operation in DMTApi.
 * @export
 * @interface DMTApiInstantiateEntityRequest
 */
export interface DMTApiInstantiateEntityRequest {
  /**
   *
   * @type {BasicEntity}
   * @memberof DMTApiInstantiateEntity
   */
  readonly basicEntity: BasicEntity
}

/**
 * Request parameters for jobResult operation in DMTApi.
 * @export
 * @interface DMTApiJobResultRequest
 */
export interface DMTApiJobResultRequest {
  /**
   *
   * @type {string}
   * @memberof DMTApiJobResult
   */
  readonly jobUid: string
}

/**
 * Request parameters for jobStatus operation in DMTApi.
 * @export
 * @interface DMTApiJobStatusRequest
 */
export interface DMTApiJobStatusRequest {
  /**
   *
   * @type {string}
   * @memberof DMTApiJobStatus
   */
  readonly jobUid: string
}

/**
 * Request parameters for removeJob operation in DMTApi.
 * @export
 * @interface DMTApiRemoveJobRequest
 */
export interface DMTApiRemoveJobRequest {
  /**
   *
   * @type {string}
   * @memberof DMTApiRemoveJob
   */
  readonly jobUid: string
}

/**
 * Request parameters for startJob operation in DMTApi.
 * @export
 * @interface DMTApiStartJobRequest
 */
export interface DMTApiStartJobRequest {
  /**
   *
   * @type {string}
   * @memberof DMTApiStartJob
   */
  readonly jobDmssId: string
}

/**
 * DMTApi - object-oriented interface
 * @export
 * @class DMTApi
 * @extends {BaseAPI}
 */
export class DMTApi extends BaseAPI {
  /**
   *
   * @summary Create Application
   * @param {DMTApiCreateAppRequest} requestParameters Request parameters.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DMTApi
   */
  public createApp(requestParameters: DMTApiCreateAppRequest, options?: any) {
    return DMTApiFp(this.configuration)
      .createApp(
        requestParameters.dataSourceId,
        requestParameters.applicationId,
        options
      )
      .then((request) => request(this.axios, this.basePath))
  }

  /**
   *
   * @summary Generate Code With Plugin
   * @param {DMTApiGenerateCodeRequest} requestParameters Request parameters.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DMTApi
   */
  public generateCode(
    requestParameters: DMTApiGenerateCodeRequest,
    options?: any
  ) {
    return DMTApiFp(this.configuration)
      .generateCode(
        requestParameters.dataSourceId,
        requestParameters.pluginName,
        requestParameters.documentPath,
        options
      )
      .then((request) => request(this.axios, this.basePath))
  }

  /**
   *
   * @summary Get Application Settings
   * @param {DMTApiGetAppSettingsRequest} requestParameters Request parameters.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DMTApi
   */
  public getAppSettings(
    requestParameters: DMTApiGetAppSettingsRequest = {},
    options?: any
  ) {
    return DMTApiFp(this.configuration)
      .getAppSettings(requestParameters.applicationName, options)
      .then((request) => request(this.axios, this.basePath))
  }

  /**
   *
   * @summary Get
   * @param {DMTApiGetBlueprintsRequest} requestParameters Request parameters.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DMTApi
   */
  public getBlueprints(
    requestParameters: DMTApiGetBlueprintsRequest,
    options?: any
  ) {
    return DMTApiFp(this.configuration)
      .getBlueprints(requestParameters.target, options)
      .then((request) => request(this.axios, this.basePath))
  }

  /**
   *
   * @summary Instantiate
   * @param {DMTApiInstantiateEntityRequest} requestParameters Request parameters.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DMTApi
   */
  public instantiateEntity(
    requestParameters: DMTApiInstantiateEntityRequest,
    options?: any
  ) {
    return DMTApiFp(this.configuration)
      .instantiateEntity(requestParameters.basicEntity, options)
      .then((request) => request(this.axios, this.basePath))
  }

  /**
   *
   * @summary Result
   * @param {DMTApiJobResultRequest} requestParameters Request parameters.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DMTApi
   */
  public jobResult(requestParameters: DMTApiJobResultRequest, options?: any) {
    return DMTApiFp(this.configuration)
      .jobResult(requestParameters.jobUid, options)
      .then((request) => request(this.axios, this.basePath))
  }

  /**
   *
   * @summary Status
   * @param {DMTApiJobStatusRequest} requestParameters Request parameters.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DMTApi
   */
  public jobStatus(requestParameters: DMTApiJobStatusRequest, options?: any) {
    return DMTApiFp(this.configuration)
      .jobStatus(requestParameters.jobUid, options)
      .then((request) => request(this.axios, this.basePath))
  }

  /**
   *
   * @summary Remove
   * @param {DMTApiRemoveJobRequest} requestParameters Request parameters.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DMTApi
   */
  public removeJob(requestParameters: DMTApiRemoveJobRequest, options?: any) {
    return DMTApiFp(this.configuration)
      .removeJob(requestParameters.jobUid, options)
      .then((request) => request(this.axios, this.basePath))
  }

  /**
   *
   * @summary Set Application Settings
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DMTApi
   */
  public setAppSettings(options?: any) {
    return DMTApiFp(this.configuration)
      .setAppSettings(options)
      .then((request) => request(this.axios, this.basePath))
  }

  /**
   *
   * @summary Start
   * @param {DMTApiStartJobRequest} requestParameters Request parameters.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DMTApi
   */
  public startJob(requestParameters: DMTApiStartJobRequest, options?: any) {
    return DMTApiFp(this.configuration)
      .startJob(requestParameters.jobDmssId, options)
      .then((request) => request(this.axios, this.basePath))
  }
}
