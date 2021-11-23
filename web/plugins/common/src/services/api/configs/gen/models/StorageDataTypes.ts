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

/**
 * An enumeration.
 * @export
 * @enum {string}
 */
export enum StorageDataTypes {
    Default = 'default',
    Large = 'large',
    VeryLarge = 'veryLarge',
    Video = 'video',
    Blob = 'blob'
}

export function StorageDataTypesFromJSON(json: any): StorageDataTypes {
    return StorageDataTypesFromJSONTyped(json, false);
}

export function StorageDataTypesFromJSONTyped(json: any, ignoreDiscriminator: boolean): StorageDataTypes {
    return json as StorageDataTypes;
}

export function StorageDataTypesToJSON(value?: StorageDataTypes | null): any {
    return value as any;
}
