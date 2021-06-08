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
    DataSourceType,
    DataSourceTypeFromJSON,
    DataSourceTypeFromJSONTyped,
    DataSourceTypeToJSON,
} from './';

/**
 * 
 * @export
 * @interface Repository
 */
export interface Repository {
    /**
     * 
     * @type {DataSourceType}
     * @memberof Repository
     */
    type: DataSourceType;
    /**
     * 
     * @type {string}
     * @memberof Repository
     */
    host?: string;
    /**
     * 
     * @type {number}
     * @memberof Repository
     */
    port?: number;
    /**
     * 
     * @type {string}
     * @memberof Repository
     */
    username?: string;
    /**
     * 
     * @type {string}
     * @memberof Repository
     */
    password?: string;
    /**
     * 
     * @type {string}
     * @memberof Repository
     */
    database?: string;
    /**
     * 
     * @type {string}
     * @memberof Repository
     */
    collection?: string;
    /**
     * 
     * @type {string}
     * @memberof Repository
     */
    accountName?: string;
    /**
     * 
     * @type {string}
     * @memberof Repository
     */
    accountKey?: string;
    /**
     * 
     * @type {boolean}
     * @memberof Repository
     */
    tls?: boolean;
}

export function RepositoryFromJSON(json: any): Repository {
    return RepositoryFromJSONTyped(json, false);
}

export function RepositoryFromJSONTyped(json: any, ignoreDiscriminator: boolean): Repository {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'type': DataSourceTypeFromJSON(json['type']),
        'host': !exists(json, 'host') ? undefined : json['host'],
        'port': !exists(json, 'port') ? undefined : json['port'],
        'username': !exists(json, 'username') ? undefined : json['username'],
        'password': !exists(json, 'password') ? undefined : json['password'],
        'database': !exists(json, 'database') ? undefined : json['database'],
        'collection': !exists(json, 'collection') ? undefined : json['collection'],
        'accountName': !exists(json, 'account_name') ? undefined : json['account_name'],
        'accountKey': !exists(json, 'account_key') ? undefined : json['account_key'],
        'tls': !exists(json, 'tls') ? undefined : json['tls'],
    };
}

export function RepositoryToJSON(value?: Repository | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'type': DataSourceTypeToJSON(value.type),
        'host': value.host,
        'port': value.port,
        'username': value.username,
        'password': value.password,
        'database': value.database,
        'collection': value.collection,
        'account_name': value.accountName,
        'account_key': value.accountKey,
        'tls': value.tls,
    };
}


