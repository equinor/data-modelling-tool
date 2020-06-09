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
 * @interface InlineResponse2001
 */
export interface InlineResponse2001 {
  /**
   *
   * @type {string}
   * @memberof InlineResponse2001
   */
  uid?: string
}

export function InlineResponse2001FromJSON(json: any): InlineResponse2001 {
  return InlineResponse2001FromJSONTyped(json, false)
}

export function InlineResponse2001FromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): InlineResponse2001 {
  if (json === undefined || json === null) {
    return json
  }
  return {
    uid: !exists(json, 'uid') ? undefined : json['uid'],
  }
}

export function InlineResponse2001ToJSON(
  value?: InlineResponse2001 | null
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    uid: value.uid,
  }
}
