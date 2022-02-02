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
export enum RepositoryType {
    MongoDb = 'mongo-db',
    AzureBlobStorage = 'azure-blob-storage',
    LocalStorage = 'localStorage'
}

export function RepositoryTypeFromJSON(json: any): RepositoryType {
    return RepositoryTypeFromJSONTyped(json, false);
}

export function RepositoryTypeFromJSONTyped(json: any, ignoreDiscriminator: boolean): RepositoryType {
    return json as RepositoryType;
}

export function RepositoryTypeToJSON(value?: RepositoryType | null): any {
    return value as any;
}
