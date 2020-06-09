/* tslint:disable */
/* eslint-disable */
/**
 * Data Modelling Storage Service API
 * Data storage service for DMT
 *
 * The version of the OpenAPI document: 0.1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime'
/**
 *
 * @export
 * @interface InlineObject1
 */
export interface InlineObject1 {
  /**
   *
   * @type {string}
   * @memberof InlineObject1
   */
  documentId: string
  /**
   *
   * @type {string}
   * @memberof InlineObject1
   */
  parentId?: string | null
}

export function InlineObject1FromJSON(json: any): InlineObject1 {
  return InlineObject1FromJSONTyped(json, false)
}

export function InlineObject1FromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): InlineObject1 {
  if (json === undefined || json === null) {
    return json
  }
  return {
    documentId: json['documentId'],
    parentId: !exists(json, 'parentId') ? undefined : json['parentId'],
  }
}

export function InlineObject1ToJSON(value?: InlineObject1 | null): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    documentId: value.documentId,
    parentId: value.parentId,
  }
}
