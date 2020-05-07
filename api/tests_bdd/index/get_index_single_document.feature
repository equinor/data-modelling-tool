Feature: Index

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name             | database | collection | documentType | type     |
      | db   | 27017 | maf      | maf      | false | data-source-name | local    | documents  | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | system           | local    | system     | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | test-source-name | local    | test       | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | entities-DS      | local    | test       | entities     | mongo-db |

    Given data modelling tool templates are imported

    Given there are documents for the data source "data-source-name" in collection "documents"
      | uid | parent_uid | name          | description | type                   |
      | 1   |            | blueprints    |             | system/SIMOS/Package     |
      | 2   | 1          | sub_package_1 |             | system/SIMOS/Package     |
      | 3   | 2          | document_1    |             | system/SIMOS/Blueprint |

    Given there are documents for the data source "entities-DS" in collection "test"
      | uid | parent_uid | name       | description | type               |
      | 1   |            | entity |             | system/SIMOS/Package |

  Scenario: Get index for single document (Root Package)
    Given I access the resource url "/api/v4/index/data-source-name/1/1"
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
       "1":{
          "parentId": null,
          "title":"blueprints",
          "id":"1",
          "nodeType":"document-node",
          "children":["2"],
          "type":"system/SIMOS/Package"
       }
    }
    """

  Scenario: Get index for single document (Package)
    Given I access the resource url "/api/v4/index/data-source-name/1/2"
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "2": {
        "id": "2",
        "children": [
          "3"
        ],
        "nodeType": "document-node",
        "title": "sub_package_1",
        "type": "system/SIMOS/Package",
        "meta": {
          "menuItems": [
            {
              "label":"New",
              "menuItems":[
                {
                  "label":"Package",
                  "action":"CREATE"
                },
                {
                  "label":"Blueprint",
                  "action":"CREATE",
                  "data":{
                  "url":"/api/v2/explorer/data-source-name/add-file",
                  "schemaUrl":"/api/v2/json-schema/system/SIMOS/Blueprint?ui_recipe=DEFAULT_CREATE",
                  "nodeUrl":"/api/v4/index/data-source-name/2",
                  "request":{
                    "type":"system/SIMOS/Blueprint",
                    "parentId":"2",
                    "attribute":"content",
                    "name":"${name}",
                    "description":"${description}"
                    }
                  }
                }
            ]
          }]
        }
      }
    }
    """

  Scenario: Get index for single document (Blueprint)
    Given I access the resource url "/api/v4/index/data-source-name/2/3"
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
       "3":{
          "parentId": null,
          "title":"document_1",
          "id":"3",
          "nodeType":"document-node",
          "children":[],
          "type":"system/SIMOS/Blueprint"
       }
    }
    """

  Scenario: Get index for single document (Entity)
    Given I access the resource url "/api/v4/index/entities-DS/1/1"
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "1": {
        "id": "1",
        "title": "entity",
        "type": "system/SIMOS/Package",
        "meta": {
          "menuItems": [
            {
              "label":"New",
              "menuItems":[
                {
                  "label":"Package",
                  "action":"CREATE"
                },
                {
                  "label":"Entity",
                  "action":"CREATE",
                  "data":{
                  "url":"/api/v2/explorer/entities-DS/add-file",
                  "schemaUrl":"/api/v2/json-schema/system/SIMOS/Entity?ui_recipe=DEFAULT_CREATE",
                  "nodeUrl":"/api/v4/index/entities-DS/1",
                  "request":{
                    "type":"system/SIMOS/Entity",
                    "parentId":"1",
                    "attribute":"content",
                    "name":"${name}",
                    "description":"${description}"
                    }
                  }
                }
            ]
          }]
        }
      }
    }
    """
