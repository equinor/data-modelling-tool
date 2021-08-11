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

import { exists, mapValues } from '../runtime';
import {
    EntityType,
    EntityTypeFromJSON,
    EntityTypeFromJSONTyped,
    EntityTypeToJSON,
} from './';

/**
 * 
 * @export
 * @interface SearchDataRequest
 */
export interface SearchDataRequest {
    /**
     * 
     * @type {EntityType}
     * @memberof SearchDataRequest
     */
    type: EntityType;
}

export function SearchDataRequestFromJSON(json: any): SearchDataRequest {
    return SearchDataRequestFromJSONTyped(json, false);
}

export function SearchDataRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): SearchDataRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'type': EntityTypeFromJSON(json['type']),
    };
}

export function SearchDataRequestToJSON(value?: SearchDataRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'type': EntityTypeToJSON(value.type),
    };
}

