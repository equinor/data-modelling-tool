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
import { ErrorResponse } from '../models'
// @ts-ignore
import { GetJobResultResponse } from '../models'
// @ts-ignore
import { StartJobResponse } from '../models'
// @ts-ignore
import { StartJobResponse } from '../models'
// @ts-ignore
import { StatusJobResponse } from '../models'
/**
 * JobsApi - axios parameter creator
 * @export
 */
export const JobsApiAxiosParamCreator = function (
  configuration?: Configuration
) {
  return {
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
 * JobsApi - functional programming interface
 * @export
 */
export const JobsApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = JobsApiAxiosParamCreator(configuration)
  return {
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
 * JobsApi - factory interface
 * @export
 */
export const JobsApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = JobsApiFp(configuration)
  return {
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
 * Request parameters for jobResult operation in JobsApi.
 * @export
 * @interface JobsApiJobResultRequest
 */
export interface JobsApiJobResultRequest {
  /**
   *
   * @type {string}
   * @memberof JobsApiJobResult
   */
  readonly jobUid: string
}

/**
 * Request parameters for jobStatus operation in JobsApi.
 * @export
 * @interface JobsApiJobStatusRequest
 */
export interface JobsApiJobStatusRequest {
  /**
   *
   * @type {string}
   * @memberof JobsApiJobStatus
   */
  readonly jobUid: string
}

/**
 * Request parameters for removeJob operation in JobsApi.
 * @export
 * @interface JobsApiRemoveJobRequest
 */
export interface JobsApiRemoveJobRequest {
  /**
   *
   * @type {string}
   * @memberof JobsApiRemoveJob
   */
  readonly jobUid: string
}

/**
 * Request parameters for startJob operation in JobsApi.
 * @export
 * @interface JobsApiStartJobRequest
 */
export interface JobsApiStartJobRequest {
  /**
   *
   * @type {string}
   * @memberof JobsApiStartJob
   */
  readonly jobDmssId: string
}

/**
 * JobsApi - object-oriented interface
 * @export
 * @class JobsApi
 * @extends {BaseAPI}
 */
export class JobsApi extends BaseAPI {
  /**
   *
   * @summary Result
   * @param {JobsApiJobResultRequest} requestParameters Request parameters.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof JobsApi
   */
  public jobResult(requestParameters: JobsApiJobResultRequest, options?: any) {
    return JobsApiFp(this.configuration)
      .jobResult(requestParameters.jobUid, options)
      .then((request) => request(this.axios, this.basePath))
  }

  /**
   *
   * @summary Status
   * @param {JobsApiJobStatusRequest} requestParameters Request parameters.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof JobsApi
   */
  public jobStatus(requestParameters: JobsApiJobStatusRequest, options?: any) {
    return JobsApiFp(this.configuration)
      .jobStatus(requestParameters.jobUid, options)
      .then((request) => request(this.axios, this.basePath))
  }

  /**
   *
   * @summary Remove
   * @param {JobsApiRemoveJobRequest} requestParameters Request parameters.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof JobsApi
   */
  public removeJob(requestParameters: JobsApiRemoveJobRequest, options?: any) {
    return JobsApiFp(this.configuration)
      .removeJob(requestParameters.jobUid, options)
      .then((request) => request(this.axios, this.basePath))
  }

  /**
   *
   * @summary Start
   * @param {JobsApiStartJobRequest} requestParameters Request parameters.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof JobsApi
   */
  public startJob(requestParameters: JobsApiStartJobRequest, options?: any) {
    return JobsApiFp(this.configuration)
      .startJob(requestParameters.jobDmssId, options)
      .then((request) => request(this.axios, this.basePath))
  }
}
