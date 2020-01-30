Feature: Index

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name             | database | collection | documentType | type     |
      | db   | 27017 | maf      | maf      | false | data-source-name | local      | documents  | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | system           | local      | system     | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | test-source-name | local      | test       | blueprints   | mongo-db |

    Given there are documents for the data source "data-source-name" in collection "documents"
      | uid | parent_uid | name          | description | type                                    |
      | 1   |            | blueprints    |             | system/DMT/Package                      |
      | 2   | 1          | sub_package_1 |             | system/DMT/Package                      |
      | 3   | 2          | document_1    |             | system/SIMOS/Blueprint                  |
      | 4   | 1          | custom_1      |             | test-source-name/TestData/TestContainer |

    Given there exist document with id "1" in data source "test-source-name"
    """
    {
        "name": "TestData",
        "description": "",
        "type": "system/DMT/Package",
        "content": [
            {
                "_id": "3",
                "type": "test-source-name/TestData/TestContainer",
                "name": "TestContainer"
            },
            {
                "_id": "2",
                "type": "test-source-name/TestData/ItemType",
                "name": "ItemType"
            }
        ],
        "isRoot": true,
        "storageRecipes": [],
        "uiRecipes": []
    }
    """

    Given there exist document with id "2" in data source "test-source-name"
    """
    {
      "type": "system/SIMOS/Blueprint",
      "name": "ItemType",
      "description": "",
      "attributes": [
        {
          "attributeType": "string", "type": "system/SIMOS/BlueprintAttribute",
          "name": "name"
        },
        {
          "attributeType": "string", "type": "system/SIMOS/BlueprintAttribute",
          "name": "description"
        },
        {
          "attributeType": "string", "type": "system/SIMOS/BlueprintAttribute",
          "name": "extra"
        }
      ],
      "storageRecipes": [],
      "uiRecipes": []
    }
    """

    Given there exist document with id "3" in data source "test-source-name"
    """
    {
      "type": "system/SIMOS/Blueprint",
      "name": "TestContainer",
      "description": "",
      "attributes": [
        {
          "attributeType": "string", "type": "system/SIMOS/BlueprintAttribute",
          "name": "name"
        },
        {
          "attributeType": "string", "type": "system/SIMOS/BlueprintAttribute",
          "name": "description"
        },
        {
          "attributeType": "string", "type": "system/SIMOS/BlueprintAttribute",
          "name": "type"
        },
        {
          "attributeType": "string", "type": "system/SIMOS/BlueprintAttribute",
          "optional": true,
          "name": "itemNotContainedInStorage"
        },
        {
          "attributeType": "string", "type": "system/SIMOS/BlueprintAttribute",
          "dimensions": "*",
          "optional": true,
          "name": "itemsNotContainedInStorage"
        },
        {
          "attributeType": "string", "type": "system/SIMOS/BlueprintAttribute",
          "optional": true,
          "name": "itemNotContainedInUi"
        },
        {
          "attributeType": "string", "type": "system/SIMOS/BlueprintAttribute",
          "dimensions": "*",
          "optional": true,
          "name": "itemsNotContainedInUi"
        }
      ],
      "storageRecipes": [
        {
          "name": "DefaultStorageRecipe",
          "type": "system/SIMOS/StorageRecipe",
          "description": "",
          "attributes": [
            {
              "name": "itemNotContainedInStorage",
              "type": "test-source-name/TestData/ItemType",
              "contained": false
            },
            {
              "name": "itemsNotContainedInStorage",
              "type": "test-source-name/TestData/ItemType",
              "contained": false
            }
          ]
        }
      ],
      "uiRecipes": [
        {
          "type": "system/SIMOS/UiRecipe",
          "name": "EDIT",
          "description": "",
          "attributes": [
            {
              "name": "itemNotContainedInUi",
              "type": "test-source-name/TestData/ItemType",
              "contained": false
            },
            {
              "name": "itemsNotContainedInUi",
              "type": "test-source-name/TestData/ItemType",
              "contained": false
            }
          ]
        }
      ]
    }
    """

  Scenario: Get index for single document (Root Package)
    Given I access the resource url "/api/v4/index/data-source-name/1/1"
    And data modelling tool templates are imported
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
          "children":["2", "4"],
          "type":"system/DMT/Package"
       }
    }
    """

  Scenario: Get index for single document (Package)
    Given I access the resource url "/api/v4/index/data-source-name/1/2"
    And data modelling tool templates are imported
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
         "type": "system/DMT/Package"
       }
    }
    """

  Scenario: Get index for single document (Blueprint)
    Given I access the resource url "/api/v4/index/data-source-name/2/3"
    And data modelling tool templates are imported
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

  @skip
  Scenario: Get index for single document (Document)
    Given I access the resource url "/api/v4/index/data-source-name/3/4"
    And data modelling tool templates are imported
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
       "4":{
         "parentId": null,
         "title":"custom_1",
         "id":"4",
         "nodeType":"document-node",
         "children":[
           "4.itemNotContainedInUi_itemNotContainedInUi",
           "4_itemsNotContainedInUi"
         ],
         "type":"test-source-name/TestData/TestContainer"
       },
       "4.itemNotContainedInUi_itemNotContainedInUi": {
         "children": [],
         "id": "4.itemNotContainedInUi_itemNotContainedInUi",
         "nodeType": "document-node",
         "parentId": "4",
         "title": "itemNotContainedInUi",
         "type": "test-source-name/TestData/ItemType"
      },
      "4_itemsNotContainedInUi": {
         "children": [],
         "id": "4_itemsNotContainedInUi",
         "nodeType": "document-node",
         "parentId": "4",
         "title": "itemsNotContainedInUi",
         "type": "test-source-name/TestData/TestContainer"
      }
    }
    """


